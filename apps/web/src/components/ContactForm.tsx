"use client"

import type React from "react"

import { useState } from "react"

interface ContactFormProps {
  language: "it" | "en"
}

export function ContactForm({ language }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const isItalian = language === "it"

  const labels = {
    name: isItalian ? "Nome" : "Name",
    email: isItalian ? "Email" : "Email",
    message: isItalian ? "Messaggio" : "Message",
    submit: isItalian ? "Invia" : "Send",
    sending: isItalian ? "Invio..." : "Sending...",
    success: isItalian ? "Messaggio inviato con successo!" : "Message sent successfully!",
    error: isItalian ? "Errore nell'invio del messaggio." : "Error sending message.",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.honeypot) {
      return
    }

    setStatus("sending")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", message: "", honeypot: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {labels.name}
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded bg-background"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {labels.email}
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded bg-background"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          {labels.message}
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded bg-background resize-none"
        />
      </div>

      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-6 py-3 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "sending" ? labels.sending : labels.submit}
      </button>

      {status === "success" && <p className="text-green-600">{labels.success}</p>}
      {status === "error" && <p className="text-red-600">{labels.error}</p>}
    </form>
  )
}
