import express from "express";
import { createServer as createViteServer } from "vite";
import Sitemapper from "sitemapper";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import nodemailer from "nodemailer";
import { Parser } from "json2csv";
import Database from "better-sqlite3";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const db = new Database("auditor.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT,
    email TEXT,
    pages_analyzed INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/sitemap", async (req, res) => {
    const { domain } = req.query;
    if (!domain || typeof domain !== "string") {
      return res.status(400).json({ error: "Domain is required" });
    }

    const sitemap = new Sitemapper({
      url: domain.startsWith("http") ? domain : `https://${domain}/sitemap.xml`,
      timeout: 15000,
    });

    try {
      const { sites } = await sitemap.fetch();
      
      // Categorization logic
      const mainKeywords = ['about', 'services', 'contact', 'pricing', 'faq', 'team', 'careers', 'home', 'portfolio'];
      
      const categorized = sites.map((url: string) => {
        const urlObj = new URL(url);
        const path = urlObj.pathname.toLowerCase();
        const segments = path.split('/').filter(Boolean);
        
        let category: 'cms' | 'main' | 'other' = 'other';
        
        if (path === '/' || path === '/index.html') {
          category = 'main';
        } else if (segments.length === 1 && mainKeywords.some(k => segments[0].includes(k))) {
          category = 'main';
        } else if (segments.length >= 2) {
          // Likely part of a CMS structure if it has depth
          category = 'cms';
        } else if (segments.length === 1) {
          category = 'other';
        }
        
        return { url, category };
      });

      res.json({ urls: categorized });
    } catch (error) {
      console.error("Sitemap fetch error:", error);
      res.status(500).json({ error: "Failed to fetch sitemap" });
    }
  });

  app.get("/api/vitals", async (req, res) => {
    const { url } = req.query;
    const apiKey = process.env.PAGESPEED_API_KEY;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Using PageSpeed Insights API v5
      // We'll fetch mobile strategy by default as it's more critical for CWV
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
      )}&category=performance&strategy=mobile${apiKey ? `&key=${apiKey}` : ""}`;

      const response = await axios.get(psiUrl);
      const data = response.data;

      // Extract Core Web Vitals
      const audit = data.lighthouseResult.audits;
      const loadingExperience = data.loadingExperience?.metrics;

      // Extract insights (opportunities and diagnostics with low scores)
      const insights = Object.values(audit)
        .filter((a: any) => a.score !== null && a.score < 0.9 && (a.details?.type === 'opportunity' || a.details?.type === 'critical-request-chains'))
        .map((a: any) => ({
          title: a.title,
          description: a.description.replace(/\[Learn more\]\(.*\)\./g, ''),
          score: a.score
        }))
        .slice(0, 5); // Top 5 issues

      const vitals = {
        lcp: loadingExperience?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || audit["largest-contentful-paint"]?.numericValue,
        inp: loadingExperience?.INTERACTION_TO_NEXT_PAINT?.percentile || audit["interactive"]?.numericValue,
        cls: loadingExperience?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile / 100 || audit["cumulative-layout-shift"]?.numericValue,
        performanceScore: data.lighthouseResult.categories.performance.score * 100,
        insights
      };

      res.json(vitals);
    } catch (error: any) {
      console.error("PSI API error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch vitals" });
    }
  });

  app.post("/api/record-audit", (req, res) => {
    const { domain, email, pagesAnalyzed } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO audits (domain, email, pages_analyzed) VALUES (?, ?, ?)");
      stmt.run(domain, email || null, pagesAnalyzed);
      res.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to record audit" });
    }
  });

  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPass = process.env.ADMIN_PASSWORD || "securepassword123";

    if (email === adminEmail && password === adminPass) {
      res.json({ success: true, token: "mock-admin-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer mock-admin-token") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      const totalAudits = db.prepare("SELECT COUNT(*) as count FROM audits").get() as any;
      const totalPages = db.prepare("SELECT SUM(pages_analyzed) as count FROM audits").get() as any;
      const emails = db.prepare("SELECT DISTINCT email FROM audits WHERE email IS NOT NULL").all() as any[];

      res.json({
        totalAudits: totalAudits.count,
        totalPagesAnalyzed: totalPages.count || 0,
        emails: emails.map(e => e.email)
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/export-full-report", async (req, res) => {
    const { email, data, domain } = req.body;

    if (!email || !data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Email and data are required" });
    }

    try {
      // 1. Generate CSV
      const fields = [
        { label: 'URL', value: 'url' },
        { label: 'Category', value: 'category' },
        { label: 'LCP (ms)', value: 'lcp' },
        { label: 'INP (ms)', value: 'inp' },
        { label: 'CLS', value: 'cls' },
        { label: 'Performance Score', value: 'performanceScore' },
        { 
          label: 'Insights', 
          value: (row: any) => row.insights?.map((i: any) => `${i.title}: ${i.description}`).join(' | ') || '' 
        }
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      // 2. Generate PDF
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`Core Web Vitals Audit Report: ${domain}`, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

      const tableData = data.map(row => [
        new URL(row.url).pathname,
        row.category,
        row.lcp ? `${(row.lcp / 1000).toFixed(2)}s` : '-',
        row.inp ? `${row.inp}ms` : '-',
        row.cls ? row.cls.toFixed(3) : '-',
        row.performanceScore ? Math.round(row.performanceScore) : '-'
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Path', 'Category', 'LCP', 'INP', 'CLS', 'Score']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0] }
      });

      // Add insights page
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Optimization Insights", 14, 22);
      let y = 35;
      data.forEach((row: any) => {
        if (row.insights && row.insights.length > 0) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(new URL(row.url).pathname, 14, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          row.insights.forEach((insight: any) => {
            const text = `${insight.title}: ${insight.description}`;
            const lines = doc.splitTextToSize(text, 180);
            doc.text(lines, 14, y);
            y += (lines.length * 5) + 2;
            if (y > 280) { doc.addPage(); y = 20; }
          });
          y += 5;
        }
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

      // 3. Send Email
      let transporter;
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const smtpPort = parseInt(process.env.SMTP_PORT || "587");
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: smtpPort,
          // secure should be true for 465, false for 587
          secure: smtpPort === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
      } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
      }

      const info = await transporter.sendMail({
        from: '"CWV Auditor" <noreply@cwv-auditor.com>',
        to: email,
        subject: `Full Audit Report - ${domain}`,
        text: `Please find attached the full Core Web Vitals audit report for ${domain}.`,
        attachments: [
          { filename: `audit-report-${domain}.csv`, content: csv },
          { filename: `audit-report-${domain}.pdf`, content: pdfBuffer }
        ],
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      res.json({ success: true, previewUrl: previewUrl || null });
    } catch (error: any) {
      console.error("Export error:", error);
      res.status(500).json({ error: "Failed to generate report: " + error.message });
    }
  });

  app.post("/api/export-email", async (req, res) => {
    const { email, data, batchIndex } = req.body;

    if (!email || !data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Email and data are required" });
    }

    try {
      const fields = [
        { label: 'URL', value: 'url' },
        { label: 'LCP (ms)', value: 'lcp' },
        { label: 'INP (ms)', value: 'inp' },
        { label: 'CLS', value: 'cls' },
        { label: 'Performance Score', value: 'performanceScore' },
        { 
          label: 'Insights', 
          value: (row: any) => row.insights?.map((i: any) => `${i.title}: ${i.description}`).join(' | ') || '' 
        }
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      // Email configuration
      // If no SMTP env vars, we use a test account
      let transporter;
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const smtpPort = parseInt(process.env.SMTP_PORT || "587");
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log("Using Ethereal test account. Preview URL: " + nodemailer.getTestMessageUrl({} as any));
      }

      const info = await transporter.sendMail({
        from: '"CWV Auditor" <noreply@cwv-auditor.com>',
        to: email,
        subject: `Core Web Vitals Audit Report - Batch ${batchIndex + 1}`,
        text: `Attached is the Core Web Vitals audit report for batch ${batchIndex + 1} (50 pages).`,
        attachments: [
          {
            filename: `cwv-audit-batch-${batchIndex + 1}.csv`,
            content: csv,
          },
        ],
      });

      console.log("Message sent: %s", info.messageId);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      
      res.json({ 
        success: true, 
        messageId: info.messageId,
        previewUrl: previewUrl || null
      });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email: " + error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
