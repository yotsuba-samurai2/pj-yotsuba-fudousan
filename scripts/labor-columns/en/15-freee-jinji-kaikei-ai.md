---
title: How far has the AI integration between freee HR and freee Accounting actually come?
excerpt: freee publishes APIs across five areas including accounting and HR, and in March 2026 it released freee-mcp as open-source software, letting AI agents operate those APIs directly. On the HR side, AI Year-End Adjustment Assist and the AI Attendance Checker came first. Working from the official announcements, we set out what becomes automatic and what remains a matter of judgement.
category: How labour administration works
faqHeading: Frequently asked questions
keywords: freee HR freee Accounting integration | freee AI year-end adjustment | freee AI attendance checker | freee-mcp | payroll journal entry automation freee | how far can AI automate labour administration
tags: freee | AI | payroll | year-end adjustment | attendance management | back office
---

**In short:** freee publishes APIs across five areas — accounting, HR (人事労務), invoicing, project time tracking and sales — and in March 2026 it released **freee-mcp** as open-source software, so that AI agents can operate them directly. On the HR side, **AI Year-End Adjustment Assist** and the **AI Attendance Checker** came first. The link that carries payroll results into accounting as journal entries has existed for some time; AI is being layered on top of it. **What is not automated is judgement.**

We are asked more and more often whether freee's AI will make both labour administration and bookkeeping run by themselves. Reading the official announcements, **real progress is being made.** But it is more accurate to look at the announcements separately, and to be clear about what each one covers.

## How are HR and accounting connected in the first place?

Before the AI, the foundation.

When you run payroll in freee HR, monthly salary, social insurance contributions and income tax and resident tax withholdings are calculated. **Those results can then flow automatically into freee Accounting as "payroll journal entries."** That is the heart of the integration. It removes the re-keying, and the transcription errors that come with it.

**AI sits on top of that foundation.** Adding AI where the foundation is missing achieves little.

## How does freee position AI?

On 14 May 2025 freee announced its **AI concept**. What it sets out is "**integrated flow**" × "**AI**."

"Integrated flow" is freee's umbrella term for its design philosophy, made up of Work flow, Communication flow and Data flow. AI is to be multiplied into that. The same announcement opened applications for the AI agent **freee AI (beta)**.

freee's own wording is that it will go beyond making back-office work more efficient and "**evolve into a partner in management.**"

## What is moving on the HR side?

In the same announcement of 14 May 2025, two of the functions offered as a closed beta bear directly on HR.

| Function | What it does |
|---|---|
| **AI Year-End Adjustment Assist** | An employee photographs the paperwork and the entry for the year-end adjustment is assisted. For life insurance premium deductions, the policyholder, type of policy, category and amount are filled in automatically. It also **detects errors** such as documents from the wrong year |
| **AI Attendance Checker** | Instruct the AI to check attendance and it **lists the employees whose records are incomplete**, then handles the correction and chasing messages. It proposes several patterns of chasing message and sends the one you choose |

**AI Year-End Adjustment Assist is stated as being provided from the 2025 year-end adjustment onwards.**

These two match what the work actually feels like. **Year-end adjustment errors and chasing people at attendance close** are both the kind of task where a person checks the same thing over and over.

## What changed in 2026?

**On 2 March 2026, freee released "freee-mcp" as open-source software.** This is the larger shift.

MCP (Model Context Protocol) is an open protocol for connecting AI assistants to external tools. "freee-mcp" turns roughly **270 of the Public APIs** freee has offered since 2018 — across accounting, HR, invoicing, project time tracking and sales — into MCP tools.

freee's announcement puts it this way:

> Simply asking, in a chat, "create an invoice," completes the whole sequence accurately, from registering the counterparty through to issuing the invoice.

It is stated as usable from the main AI tools, including Claude Desktop, Claude Code, Claude Cowork and Cursor.

**In other words, the entrance is shifting from "a person operates the freee screen" to "you ask the AI and freee moves."** Takashi Yokoji, freee's co-founder and CAIO, is quoted in the announcement as having said at a press briefing:

> SaaS has become something used by AI, not something used by people.

## So does labour administration stop being a job?

**The work gets lighter. The judgement stays.**

Entering the year-end adjustment, chasing attendance, issuing invoices — these are **tasks with a settled procedure**. Because the procedure is settled, it can be automated.

Labour administration also contains things where no procedure is settled.

- Whether the person you engage under a service contract **is in fact a worker**
- Whether a part-timer **ought to be enrolled in social insurance** (and how to design the contracted hours)
- Whether the **requirements for a subsidy** are met
- **How to write** work rules that fit this particular company

**In each of these the answer does not sit in the facts; it lies in how the facts are assessed.** AI helps as far as organising the material and laying out the issues, but **the assessment itself is made by a qualified professional.**

And when something goes wrong, it is the qualified professional who answers for it. **What AI makes cheaper is the work, not the responsibility.**

## How should a company approach this?

There is an order to it.

**1. Build the foundation first.** Connect HR and accounting so that payroll journal entries flow automatically. Without this, adding AI will not help.

**2. Hand over the settled tasks.** Assisted entry for the year-end adjustment; checking attendance records. It is safer to begin where **a mistake can still be undone**.

**3. Keep a person on anything that calls for judgement.** Worker status, enrolment in social insurance, subsidy requirements, the design of internal rules. Trying to automate this is where **putting it right afterwards costs more**.

## Frequently asked questions

**Q. Can anyone use freee-mcp?**
A. It is published as an npm package and stated to be installable by anyone from GitHub and NPM. But it **operates core business systems**, so permissions, and a record of who did what, should be settled before you introduce it.

**Q. Doesn't this mean handing client data to an AI?**
A. That is a matter each business has to decide for itself. **This office does not enter clients' personal data into generative AI.** A Certified Social Insurance and Labour Consultant is under a duty of confidentiality (Article 21 of the Certified Social Insurance and Labour Consultant Act). We use AI for research and drafting; the judgement and the final check are made by the consultant.

**Q. If we bring in AI, will we no longer need a labour consultant?**
A. The **work** of the procedures gets lighter. But preparing and filing applications under labour and social insurance legislation for a fee may only be done by a Certified Social Insurance and Labour Consultant (Article 27 of the same Act). AI does not become the qualified professional in their place.

**Q. Should we wait and see?**
A. **There is nothing to lose by putting the foundation — automatic payroll journal entries — in place now.** More AI functions will come, but they do not help a company whose data is not in order. The integration comes first.

## Sources for this article

- freee K.K., "freeeのAIコンセプトを発表 「統合flow」×「AI」でスモールビジネスの経営と組織を進化" (14 May 2025)
  https://corp.freee.co.jp/news/20250514freee_ai.html
  — AI Year-End Adjustment Assist (from the 2025 year-end adjustment), the AI Attendance Checker and freee AI (beta) are taken from this announcement
- freee K.K., "freee、AIエージェントからfreeeの基幹業務を操作可能にするMCPサーバー「freee-mcp」をOSSとして公開" (2 March 2026)
  https://corp.freee.co.jp/news/20260302freee_mcp.html
  — the roughly 270 APIs, the five areas, the AI tools supported and the remark by CAIO Takashi Yokoji are taken from this announcement
- Certified Social Insurance and Labour Consultant Act (Act No. 89 of 1968), **Article 21** (duty of confidentiality) and **Article 27** (restriction on business)

**Function names, availability and timing change. Please check freee's official site for the current position before deciding to adopt anything.** This article reflects material published as at August 2026.

How this office handles procedures and payroll is set out in [From consultation to engagement](/en/labor/nagare), and the fees in the [fee schedule](/en/labor/ryokin). On how payroll is priced, see [What does it cost to have a labour consultant run your payroll?](/en/labor/column/kyuyo-keisan-soba-sharoushi).

This article is general information. Any assessment of your particular circumstances is made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu).
