---
title: Can we put employee information into an AI?
excerpt: There is no one-size-fits-all answer. Employee information is personal data; feeding it into generative AI sits within the framework of the Act on the Protection of Personal Information, and Japan's Personal Information Protection Commission has issued an alert. We set out the "no-training" settings and their limits, the four rules to fix in advance, and how this office itself handles data.
category: How labour administration works
faqHeading: Frequently asked questions
keywords: employee data generative AI input | company rules generative AI personal information | AI no-training setting opt out | internal AI policy work rules | PPC generative AI alert Japan | labour consultant confidentiality personal data
tags: AI | generative AI | personal information | no-training setting | internal rules | confidentiality
---

**In short:** there is no one-size-fits-all answer. Employee information is **personal data**; feeding it into generative AI sits within the framework of the Act on the Protection of Personal Information, and the Personal Information Protection Commission (個人情報保護委員会) has issued an alert. **Decide the lines first, then use the tools — the order is all.** Yotsuba does not enter client or employee personal data into generative AI.

"We want the AI to total the attendance records" — "we want it to summarise exchanges with an employee" — once AI arrives inside a company, the question of how much employee information may go in arrives with it. This page is for owners and back-office staff about to draw those lines. It confines itself to **presenting the statutory framework and disclosing this office's own practice**, and does not judge the lawfulness of any particular service or use.

## What can go wrong when employee information goes into an AI?

Employees' names, addresses, wages, evaluations and health information are **personal data** managed by the company. The Act on the Protection of Personal Information places this framework on the businesses that handle it:

| Provision | Framework |
|---|---|
| Article 23 | **Security control measures** — necessary and appropriate measures against leakage, loss or damage |
| Article 24 | **Supervision of employees** handling personal data |
| Article 25 | **Supervision of contractors** when handling is outsourced |
| Article 27 | **Restriction on third-party provision** — personal data may not, in principle, be provided to a third party without the person's prior consent |

On generative AI specifically, the Personal Information Protection Commission published its **"Alert Regarding the Use of Generative AI Services" (2 June 2023)**, making two points to businesses: **(1)** when entering prompts containing personal information, confirm carefully that the entry stays within the scope needed to achieve the specified purpose of use; and **(2)** where personal data is entered into a prompt without the person's consent and is then handled **for purposes other than producing the response (such as training)**, this **may violate** the Act.

How your input is handled **depends on each service's contract and settings**. That is why no blanket "this service is fine" exists — the order is: confirm, then draw the line.

## What should the company decide before using AI?

In practice, the internal decisions come down to four items. This is a presentation of decision material, not an evaluation of any service's lawfulness.

| Decision | Substance |
|---|---|
| **What may and may not go in** | An internal standard — e.g. no personal data, health or evaluation information. When in doubt, leave it out |
| **The service's settings and contract** | Whether input is used for training (next section). Corporate contracts, opt-out settings, terms of service |
| **Who may use it, and where** | Which staff, for which tasks. Whether personal accounts may be used for work |
| **Records** | Keeping it possible to check, afterwards, what went into which service |

Anchoring the rules in the work rules as service discipline is labour-management territory; the procedure is the same as described in [Can work rules drafted by an AI actually be filed?](/en/labor/column/ai-shugyokisoku-todokede-dekiruka).

## If we turn on the "no-training" setting, may the data go in?

The settings first. Many generative AI services offer a setting that **keeps your input out of model training (an opt-out)**, or contract forms that never train on input in the first place. From the providers' published materials (viewed 14 August 2026), the landscape sorts roughly into these shapes:

| Form of use | Treatment of input for training |
|---|---|
| Consumer plans | **Some services use input for training by default.** Turning this off in the settings is generally possible (ChatGPT's "Improve the model for everyone" toggle, Claude's privacy settings, and the like) |
| Corporate plans (Team, Enterprise, etc.) | Many services **do not train on input by default**, with administrators managing the organisation's settings centrally |
| Via API | Stating that input is **not used for training by default** is the norm |

This setting bears directly on point (2) of the Commission's alert — input handled **for purposes other than producing the response, such as training**. **For business use, confirming the no-training setting or contract is the starting point.** A personal account on default settings, used for work, is the most dangerous shape.

Two caveats. First, even with training off, **input data may be retained for a period — for abuse monitoring, for example**; the retention period and conditions differ by service and contract. Second, **"no training" does not mean "personal data may go in."** The questions of security control measures (Article 23) and the scope of the purpose of use remain — and even with names removed, a person can sometimes be identified from the combination of department, title and circumstances. Setting names, defaults and retention rules change frequently, so **check each provider's published materials at the time of use**.

## How is information handed to a shakai hoken roumushi protected?

When you outsource payroll or procedures, employee personal data passes to the office. Two protections apply.

First, **statutory confidentiality**. A practising shakai hoken roumushi, and the members of a corporation formed by shakai hoken roumushi, must not divulge or misappropriate secrets learned in the course of business without just cause — and the duty **continues after they leave that position** (Certified Social Insurance and Labor Consultant Act, Article 21).

Second, **the outsourcing framework**. From the company's side, the office is a contractor handling personal data, and the company is charged with supervising its contractors (Act on the Protection of Personal Information, Article 25). In other words, **asking the office how it handles data is the client's proper role**. This office discloses its practice as follows.

## How does Yotsuba handle AI and personal data?

This office uses AI in its work as well — under **an internal standard defining which information may go into which AI**, and on these terms:

- **Client and employee personal data is not entered into generative AI.** However processed, this line does not move
- What AI is given: **organising general materials, surfacing issues, drafting documents** — that far
- **Judgement on individual matters is made by the qualified representative**

The same policy applies in the work of 四葉不動産 and 四葉行政書士事務所 (each an independent business, engaged separately). How to check an AI's answers is covered in [Can I ask an AI about a labour question first, and then consult a shakai hoken roumushi?](/en/labor/column/ai-de-shirabete-kara-soudan-shite-yoika), and where freee's AI features stand in [How far has the AI integration between freee HR and freee Accounting actually come?](/en/labor/column/freee-jinji-kaikei-ai).

## What can 四葉社会保険労務士事務所 do?

四葉社会保険労務士事務所, in Kohinata, Bunkyo City, handles payroll, labour and social insurance procedures, labour consultation, and the drafting and revision of work rules. **Framing your internal AI-use rules as service discipline within the work rules** is a consultation we can take on from the labour-management side. **Consultation is free of charge.** Fees are in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often are collected on the [FAQ page](/en/labor/faq).

### Whom to consult

Situations requiring **interpretation** of the Act on the Protection of Personal Information, and the legal response when a leak occurs, are work for **an attorney**. For primary sources, see the published materials of the **Personal Information Protection Commission**. Tax goes to **a tax accountant**, registration to **a judicial scrivener**; residence-status applications, subsidies and company-formation documents are handled by **四葉行政書士事務所** (a separate business from this office, engaged under a separate contract). In every case, no referral fees change hands.

## Frequently asked questions

**Q. Is it illegal to put employees' names or salaries into an AI?**
A. There is no blanket answer. The Personal Information Protection Commission has said that entering personal data into a prompt without the person's consent, where it is handled for purposes other than producing the response, may violate the Act (alert of 2 June 2023). Since the treatment turns on each service's contract and settings, we recommend deciding the lines before use. Where a judgement of lawfulness is needed, consult an attorney.

**Q. If we turn on the "no-training" setting, may employee information go in?**
A. Checking the setting is an important starting point, but it does not by itself make the data acceptable to enter. Even with training off, input may be retained for a period, and the questions of security control measures (Article 23) and the scope of the purpose of use remain. This office does not enter client or employee personal data into generative AI, whatever the settings.

**Q. Is it safe to hand payroll data to a shakai hoken roumushi?**
A. A practising shakai hoken roumushi, and the members of a corporation formed by shakai hoken roumushi, are under a statutory duty of confidentiality that continues after they leave the position (Certified Social Insurance and Labor Consultant Act, Article 21). And from the company's side, the office is a contractor whose data handling the company is charged with supervising (Act on the Protection of Personal Information, Article 25). Asking an office how it handles data is the client's proper role.

**Q. Where do we take the drafting of internal AI-use rules?**
A. The part framed as service discipline within the work rules can be taken on by a shakai hoken roumushi. Parts requiring interpretation of the Act on the Protection of Personal Information go to an attorney, and for primary sources see the Personal Information Protection Commission's published materials. Consultation with this office is free.

## Sources for this article

- Act on the Protection of Personal Information (個人情報の保護に関する法律, Act No. 57 of 2003), **Articles 23** (security control measures), **24** (supervision of employees), **25** (supervision of contractors) and **27** (restriction on third-party provision) — current text confirmed on e-Gov on 14 August 2026
- Certified Social Insurance and Labor Consultant Act (社会保険労務士法, Act No. 89 of 1968), **Article 21** (duty of confidentiality) — current text confirmed on e-Gov the same day
- Personal Information Protection Commission, **"Alert Regarding the Use of Generative AI Services"** (2 June 2023; viewed 14 August 2026)
  https://www.ppc.go.jp/news/careful_information/230602_AI_utilize_alert/
- The training-use settings and defaults of generative AI services — per the providers' published materials (viewed 14 August 2026). **Names, defaults and retention rules change; check each provider's materials at the time of use**

This article confines itself to presenting the statutory framework and disclosing this office's practice; it does not judge the lawfulness of any particular use of any service. Judgments that fit your particular circumstances are made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).
