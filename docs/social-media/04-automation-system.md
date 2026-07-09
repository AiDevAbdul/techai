# Content Automation System — techai.pk

**For:** Abdul Wahab, solo AI educator and consultant, Pakistan  
**Goal:** 30 days of content from one batch session; automated scheduling, cross-posting, analytics  
**Time budget:** ≤ 8 hours/month for content creation  
**Tool budget:** $0–30 Month 1 → $30–80 Month 2–3 → $80–200 Month 4+

---

## SECTION 1: TOOL STACK RECOMMENDATION

### 1.1 Design & Graphics

**Winner: Canva Pro** ($13/month, or ~Rs. 3,600/month)

Rationale for Abdul's situation:
- Figma is best for UI/UX work but has no scheduling/social-export features
- Adobe Express is limited in template quality and harder to batch-export
- Canva's Brand Kit locks your palette and fonts, so every graphic is on-brand by default
- Canva has direct Buffer integration, so you can push graphics straight to scheduler
- Pakistan payment works via Mastercard debit or PayPal; Canva accepts both

Month 1: Use Canva Free (limited template resizing but workable). Upgrade to Pro in Month 2.

**AI Image Generation: Ideogram v2 or Canva's own AI (Magic Media)**

Abdul's use case is workflow diagrams, not stock photos. Recommended approach:
- Build diagrams in Canva using shapes + arrows (faster and more controllable)
- For decorative backgrounds or section headers, use Canva Magic Media (included in Pro)
- For complex system architecture diagrams: draw in Excalidraw (free), screenshot, embed
- Avoid Midjourney/DALL-E for diagram work — they hallucinate node labels

**Canva Templates to Build (minimum viable set — build once in Month 1):**

| Platform | Format | Purpose |
|----------|--------|---------|
| LinkedIn | 1200×627 | Quote/insight image |
| Instagram | 1080×1080 | Single tip post |
| Instagram carousel cover | 1080×1080 | Series opener |
| Instagram carousel slide | 1080×1080 | Content slide |
| Instagram Reel cover | 1080×1920 | Vertical thumbnail |
| Facebook | 1200×630 | Cross-posted graphic |
| TikTok image slide | 1080×1920 | Vertical text card |
| Twitter/X | 1200×675 | Article/thread card |

Full template specs are in Section 5.

---

### 1.2 Content Writing & AI Assistance

**Primary: Claude.ai (Pro plan, $20/month) or Claude API**

Claude.ai Pro is the better starting tool because:
- No API key management needed for Month 1
- Projects feature lets you create a persistent "Abdul's Voice" persona context
- 200K context window handles full content calendars in one conversation
- Claude API becomes worth it in Month 2+ when you build n8n workflows (Section 6)

**Claude.ai Projects setup:**

Create a Project named `techai.pk Content Machine`. In the Project instructions, paste:

```
You are writing social media content for Abdul Wahab of techai.pk. 

His voice: direct, teacher-mode, practical-first, zero hype, never uses "unleash" or "game-changer". 
Writes like he's explaining to a smart friend over chai, not pitching to a boardroom.

His audiences:
- Operators: business owners who want to automate repetitive work
- Teams: employees learning AI tools inside companies  
- Communities: educators, coaches, content creators learning social media + AI

His content pillars:
- Agentic AI workflows (n8n, Make, Claude API)
- Python for non-programmers
- Social media strategy with AI
- Honest takes on AI tools (no affiliate fluff)

Brand voice rules:
- Lead with the practical application, not the theory
- Use Pakistani/South Asian context when relevant (PKR, WhatsApp-heavy market, etc.)
- Never use: "game-changer", "unlock", "revolutionize", "leverage", "synergy"
- Allowed: plain English, Urdu loan words when natural (e.g. "yaar", "bhai" in casual contexts)
- Posts end with one clear next action, not three

Output format: always provide LinkedIn version first, then adaptation notes for other platforms.
```

---

### 1.3 Scheduling & Publishing

**Winner: Metricool** (Free tier covers 1 brand, all 6 platforms Abdul uses)

Comparison matrix:

| Tool | Free Tier | Platforms | Pakistan-friendly | Price (paid) |
|------|-----------|-----------|-------------------|--------------|
| Buffer | 3 channels, 10 posts/channel | FB, IG, LI, TikTok, X | Yes | $6/mo |
| Later | IG/FB only on free | Limited | Yes | $18/mo |
| Hootsuite | No useful free tier | All | Yes | $99/mo |
| Publer | 3 accounts, 10 posts | All incl. GMB | Yes | $12/mo |
| **Metricool** | **1 brand, unlimited posts** | **All + GMB + Reddit** | **Yes** | **$18/mo** |

Metricool wins because:
- Unlimited post scheduling on free tier (Buffer caps at 10)
- Includes Google My Business scheduling (critical for local trust-building)
- Has basic analytics included
- Reddit scheduling built-in (rare in competitors)
- Accepts international payment cards

**Month 1:** Metricool Free  
**Month 2+:** Metricool Starter ($18/month) unlocks AI captions, best-time suggestions, deeper analytics

**Cross-posting workflow — create once, adapt for each platform:**

1. Write the LinkedIn version (longest, most detailed)
2. In Metricool's composer, use "Clone to other profiles" 
3. Edit each clone: trim for IG (shorten), add hashtags for IG, adjust tone for Facebook
4. Schedule all variants from one screen

**Best posting times for Pakistani audience (PKT, UTC+5):**

| Platform | Best Days | Best Times (PKT) | Notes |
|----------|-----------|-----------------|-------|
| LinkedIn | Tue–Thu | 9–11am, 12–1pm | Professional hours; avoid weekends |
| Instagram | Mon, Wed, Fri | 7–9pm | Evening scroll after work |
| Facebook | Mon–Fri | 12–2pm, 7–9pm | Lunch + evening peaks |
| TikTok | Every day | 8–10pm | Peak Pakistani mobile usage |
| Reddit | Tue–Thu | 10am–12pm PKT | Aligns with US morning (r/ subs active) |

---

### 1.4 Analytics & Tracking

**Month 1–2:** Native analytics only (free)
- LinkedIn Analytics: post impressions, follower demographics, click rate
- Instagram Insights: reach, saves, profile visits
- Facebook Page Insights: reach, engagement rate
- TikTok Analytics: views, watch time, profile visits

**Month 2+:** Metricool unified dashboard

**What to track (and when to start):**

Do not evaluate performance before 30 days of consistent posting. Before 30 days, you're just generating noise data.

At 30-day mark, track:
- Follower growth rate (% change, not raw number)
- Engagement rate by post type (text vs image vs carousel vs video)
- Top 3 posts by reach and by saves (these are different signals)
- Platform-specific click-through to website (use UTMs — see Section 7)

**Monthly analytics session: 45 minutes on the first Monday of each month.** Template in Section 9.

**Decision rules:**
- Post type drives 3x more engagement than others → make 50% of posts that type
- Platform follower growth < 10/month after 60 days → reduce posting frequency there, increase quality
- Any post gets 3x your average reach → repurpose it into a carousel the following week

---

### 1.5 Video Production (Phase 2, Month 3+)

**For screen recording tutorials:** OBS Studio (free) + CapCut (free) for editing  
**For polished edits:** DaVinci Resolve (free tier is excellent)  
**For face-optional content:** CapCut's AI voiceover or ElevenLabs ($5/month for 30k characters)

**Simple recording setup:**
- OBS: record at 1920×1080, capture browser window only (not full screen)
- Audio: even a Rs. 2,000 clip-on mic from Daraz dramatically improves quality
- CapCut: add captions automatically (90% accuracy for English), trim silences, add lower-thirds

**ElevenLabs for TikTok without showing face:**
- Clone your own voice (requires 30 seconds of clean audio sample)
- Generate voiceover from script → layer over screen recording
- Cost: $5/month for Starter plan (~30,000 characters ≈ 15 short videos)

---

## SECTION 2: THE CONTENT CREATION SYSTEM

### 2.1 The Monthly Batch System

Run this once a month. Target: complete all steps in one working day (Saturday morning preferred).

---

**Step 1: Monthly Planning Session — 45 minutes**

Date: Last Friday of previous month (or Day 1 of new month)

Actions:
1. Open `docs/social-media/content-calendar.md` (or a Notion page)
2. Pick the month's overarching theme (e.g., "May: Automating Your First Workflow")
3. Map 20 post ideas to pillars:
   - 40% Education (how-to, explainers)
   - 30% Opinion/POV (takes on AI news, tools)
   - 20% Behind the scenes (process, tools you use)
   - 10% Social proof / Results (workshop outcomes, client wins)
4. Assign each idea a platform-primary designation (where it will perform best)
5. Block 4 time slots for posting: Mon/Wed/Fri/Sun for Instagram; Tue/Thu for LinkedIn

---

**Step 2: Content Brief Creation — 60 minutes**

Open Claude.ai in the techai.pk Project. Run the Batch Ideation Prompt (Section 3) to expand your 20 ideas into full briefs. Each brief contains:
- Hook line
- 3 key points
- CTA
- Visual direction (what the graphic should show)
- Platform variants needed

Save output as a Google Doc or Notion page titled `[Month] Content Briefs`.

---

**Step 3: Graphic Production Batch — 90 minutes**

1. Open Canva, go to Brand Kit — verify colors, fonts, logo are loaded
2. Open your carousel slide template
3. For each post that needs a graphic:
   - Duplicate the master template
   - Swap text (headline + 3 points)
   - Export as PNG (2x resolution)
4. Name files consistently: `YYYYMMDD-platform-posttype.png` (e.g., `20260515-ig-carousel01.png`)
5. Upload all to a Google Drive folder: `techai.pk / Social / [Month] / Graphics`

Realistic output in 90 minutes: 15–20 graphics if templates are properly built.

---

**Step 4: Caption Writing Batch — 90 minutes**

1. Open Claude.ai techai.pk Project
2. Paste 5 briefs at a time + the relevant prompt template from Section 3
3. Review, adjust voice, approve
4. Copy to a spreadsheet: columns are Date, Platform, Caption, Hashtags, Link, Image filename

Spreadsheet template:

| Date | Platform | Caption | Hashtags | Link | Image | Status |
|------|----------|---------|----------|------|-------|--------|
| 2026-05-19 | LinkedIn | [text] | — | techai.pk/lab | 20260519-li-quote.png | Draft |

---

**Step 5: Scheduling Batch — 60 minutes**

1. Open Metricool
2. For each row in the spreadsheet: create post, upload image, paste caption, set date/time
3. Use Metricool's "Best time" suggestion as a reference, but stick to your own schedule for consistency
4. Hit "Schedule All" and close the tab

---

**Step 6: Daily Engagement Blocks — 15 minutes/day**

This is not optional. Algorithms reward accounts that engage with others.

- 7:30am: Check notifications on LinkedIn + Instagram. Reply to all comments (even just "Thanks, what part was most useful for you?")
- 7:45am: Spend 5 minutes proactively engaging on 3 posts by others in your space

Friday only (30-minute block):
- Scan r/learnpython, r/ChatGPT, r/Pakistan — leave 2–3 substantive comments
- Read 5 LinkedIn posts by target clients — leave value-adding comments

---

**Monthly time investment summary:**

| Step | Time |
|------|------|
| Planning | 45 min |
| Brief creation | 60 min |
| Graphic production | 90 min |
| Caption writing | 90 min |
| Scheduling | 60 min |
| **Batch total** | **6 hrs 15 min** |
| Daily engagement (15 min × 30 days) | 7.5 hrs |
| Monthly analytics review | 45 min |
| **Total monthly** | **~14.5 hrs** |

Note: Daily engagement time is non-negotiable for growth, but can be done from a phone while commuting or between meetings. The batch creation stays under 8 hours.

---

### 2.2 The Weekly Rhythm

| Day | Action | Time |
|-----|--------|------|
| Monday | Review last week's top posts. Note what to double down on. Check scheduler for upcoming week. | 20 min |
| Tuesday | Scheduled post goes live (LinkedIn focus day). Reply to all comments by evening. | 15 min engagement |
| Wednesday | Scheduled post goes live (Instagram + Facebook). | 15 min engagement |
| Thursday | Scheduled post goes live (LinkedIn). | 15 min engagement |
| Friday | Reddit participation (r/learnpython, r/ChatGPT). LinkedIn comment engagement on 5 posts in your niche. | 30 min |
| Saturday | Optional: batch creation day if you're working monthly-plus schedule. | — |
| Sunday | Light posting day (less competitive, good for personal/BTS content). Reply to weekend comments. | 10 min |

---

## SECTION 3: AI-POWERED CAPTION SYSTEM

### 3.1 LinkedIn Post Prompt Template

```
You are writing a LinkedIn post for Abdul Wahab of techai.pk. 

His voice: direct, practical, like a smart friend explaining something over chai. Never uses "game-changer", "unleash", "leverage", or motivational fluff. Ends posts with one clear action, not three.

Topic: [PASTE TOPIC HERE]
Audience for this post: [Operators / Teams / Communities — pick one]
Key insight to communicate: [1–2 sentences of the core idea]
CTA goal: [website visit / comment / DM / save]

Write a LinkedIn post with this structure:
1. Hook (first line only — must stop the scroll, no more than 12 words, no question marks)
2. Problem or observation (2–3 sentences setting up why this matters)
3. The insight or how-to (3–5 short paragraphs or a numbered list of 3–5 items)
4. The honest caveat or nuance (1 sentence — what this doesn't apply to)
5. CTA (one sentence, specific action)

Format rules:
- Use line breaks aggressively (no paragraph longer than 3 lines)
- No bullet points in the first 3 lines
- No hashtags in body — put 3 relevant hashtags at the very end
- Total length: 150–250 words

Example hook style (do not copy, just match the energy):
"I automated 6 hours of weekly work with 47 lines of Python."
"Pakistani businesses are leaving money on the table with this one workflow gap."
"Your VA shouldn't be doing this manually in 2026."

Output: provide the full post, then one sentence explaining why you chose that hook.
```

---

### 3.2 Instagram Caption Prompt Template

```
You are writing an Instagram caption for Abdul Wahab of techai.pk.

Topic: [PASTE TOPIC HERE]
Post type: [Single image / Carousel / Reel]
Core message (one sentence): [PASTE HERE]

Write an Instagram caption with this structure:
1. Hook line (first 125 characters must work standalone — this is what shows before "more"). Make it a bold claim or contrarian take, not a question.
2. Body (3–5 short paragraphs, max 3 lines each). If carousel: summarize what's in the slides and tell them to swipe.
3. CTA (one line: "Save this.", "Send this to your team.", "Link in bio for the full breakdown.", etc.)
4. Line break
5. Hashtags (10–15 hashtags, mix of: 3 large >1M posts, 5 medium 100k–1M, 5 small <100k, 2 niche/branded)

Hashtag categories to pull from:
Large: #AI #Python #DigitalMarketing #ContentCreator #BusinessAutomation  
Medium: #AItools #WorkflowAutomation #PakistanBusiness #SocialMediaMarketing #MakeAutomation  
Small/niche: #techai #AIWorkflows #n8nautomation #PakistanStartups #AIEducator  

Emoji rules:
- Maximum 3 emojis per caption
- Only use if they replace a word (not as decoration)
- No rocket, sparkle, or fire emojis

Output: provide caption + a list of the 12 hashtags used, sorted by size category.
```

---

### 3.3 TikTok Hook Generator Prompt

```
You are writing TikTok video scripts for Abdul Wahab of techai.pk. His TikTok content is screen recordings of AI workflows and Python code — practical, no fluff.

Topic: [PASTE TOPIC HERE]
Video length target: [30 seconds / 60 seconds / 90 seconds]
What happens in the video: [brief description of what's shown on screen]

Write a TikTok script with this structure:

HOOK (first 3 seconds, 1–2 sentences spoken while text appears on screen):
- Must create a knowledge gap ("Here's what most people don't know about X")
- Or show a surprising result first ("I just saved 3 hours using this one tool")
- Or make a bold contrast ("Beginners do X. Here's what actually works.")
- Do NOT start with "Hey guys", "In this video", or "Today I'm going to"

BODY (15–75 seconds depending on video length):
- Each point = 5–10 seconds of screen time
- Write as spoken sentences, not slides
- Keep sentences under 12 words for easy reading at speed
- Format as: [TIME STAMP] [WHAT'S ON SCREEN] [WHAT YOU SAY]

CTA (last 5 seconds):
- One action: "Follow for more Pakistan business AI content", "Comment [word] and I'll DM you the template", "Link in bio for the n8n workflow file"
- Do not list multiple CTAs

Output: full script formatted as a shooting script with timestamps.
```

---

### 3.4 Carousel Content Prompt Template

```
You are writing carousel post content for Abdul Wahab of techai.pk. Carousels are his highest-performing content type on Instagram and LinkedIn.

Topic: [PASTE TOPIC HERE]
Number of slides: [5 / 7 / 10]
Platform: [Instagram / LinkedIn / both]
Core transformation: what does the reader know or be able to do after this carousel that they couldn't before?

Write slide-by-slide content with this structure:

SLIDE 1 — COVER:
Headline (max 8 words, bold claim or specific result)
Subheadline (max 12 words, what they'll learn)
Example: "5 Python Scripts That Replace Your VA" / "Build them in under an hour — no experience needed"

SLIDES 2–[N-1] — CONTENT SLIDES:
For each slide:
- Slide number and title (max 6 words)
- Body text (max 40 words — this is on a graphic, not a blog post)
- Visual direction (what the image/diagram should show)
- One callout box or stat if applicable

LAST SLIDE — CTA:
- Recap headline ("Now you know X")
- Single CTA with specific next step
- Handle: @techai.pk

Rules:
- Each slide must work without reading the previous one
- No slide should have more than 3 bullet points
- End slides 2–N-1 with a micro-cliffhanger to keep swiping

Output: all slides in order with [SLIDE N] headers. Include visual direction for each.
```

---

### 3.5 Reddit Comment Prompt Template

```
You are drafting a Reddit comment for Abdul Wahab, who teaches AI workflows and Python in Pakistan. Reddit rewards genuine expertise, not self-promotion. Any hint of marketing will get downvoted or removed.

Subreddit: [PASTE — e.g. r/learnpython, r/ChatGPT, r/artificial, r/Pakistan]
Original post/question: [PASTE THE REDDIT POST HERE]
Abdul's relevant experience: [what he knows about this topic specifically]

Write a Reddit comment that:
1. Directly answers the question asked (not a question he wishes they'd asked)
2. Adds one specific piece of information that isn't in the top comments (check the post context)
3. Uses a personal example or experience if relevant (not hypothetical)
4. Ends with: either nothing, OR one low-pressure mention like "I wrote about this workflow on techai.pk if you want the full setup" — only if genuinely relevant
5. Sounds like a human who knows things, not a brand account

Rules:
- No bullet points in Reddit comments (looks corporate)
- No links unless directly asked for or in r/learnpython's "Resources" flair context
- Length: 3–6 sentences for most subs; 8–12 for technical deep-dives
- No self-promotion in first 3 sentences under any circumstances

Output: the comment text only. Then a one-line explanation of why you ended it the way you did.
```

---

### 3.6 Batch Ideation Prompt

```
You are generating content ideas for Abdul Wahab of techai.pk for the next 30 days. He is an AI workflow consultant and educator based in Pakistan.

Monthly theme: [PASTE THEME — e.g. "Automating your first client workflow"]
His audiences: Operators (business owners), Teams (employees), Communities (educators/coaches)
His platforms: LinkedIn, Instagram, Facebook, TikTok, Reddit, Website (Lab Notes)

Generate exactly 30 content ideas organized as follows:

PILLAR DISTRIBUTION:
- 12 Education posts (how-to, step-by-step, explainers)
- 9 Opinion/POV posts (takes, contrarian views, commentary on AI news)
- 6 Behind-the-scenes posts (tools he uses, his own workflow, mistakes)
- 3 Social proof posts (workshop outcomes, before/after, testimonial-style)

FOR EACH IDEA, PROVIDE:
- Idea number and title (max 8 words)
- Platform-primary (where it will perform best first)
- Post type (text-only / single image / carousel / short video)
- One-sentence hook
- Pillar category
- Audience segment (Operators / Teams / Communities / All)

FORMAT as a table with these columns:
# | Title | Primary Platform | Format | Hook | Pillar | Audience

After the table, flag the top 5 ideas most likely to drive website clicks (with one sentence explaining why each will convert).
```

---

## SECTION 4: THE REPURPOSING MATRIX

### 4.1 The Core Rule

One hour of creation should produce content for 5–7 posts across platforms. Never write a LinkedIn post that only lives on LinkedIn.

---

### 4.2 Master Repurposing Table

| Source | LinkedIn | Instagram | Facebook | TikTok | Reddit | Website |
|--------|----------|-----------|----------|--------|--------|---------|
| Lab Note (blog) | Thread summary (7 key points) | 7-slide carousel | Shortened excerpt + link | 60s screen walkthrough | Full answer to related question (link at end) | Source content |
| LinkedIn post | — | Single image quote of best line | Direct repost (same text) | Hook becomes video opener | If answers a question, post as comment | Expand to 800-word Lab Note |
| Instagram carousel | Reformat as numbered list post | — | Same carousel (repost) | Each slide = one TikTok | Use slide 3-5 content as comment in relevant thread | 5 slides → Lab Note outline |
| TikTok video | Write out the script as text post | Repost video + caption | Share the TikTok link | — | If it answers a question, link in relevant thread | Transcript + embed → Lab Note |
| Workshop insight | Professional debrief post | Behind-the-scenes story | Share outcome with photos | "What I taught at a workshop today" | Answer workshop question in relevant sub | Case study draft |

---

### 4.3 Repurposing Path Details

**1. Lab Note → 6 Platform Pieces**

A Lab Note is 800–1500 words. From it, extract:
- LinkedIn: Take the 5 most actionable points. Write as a numbered list with a 10-word hook. Do not summarize — pick the best points and write them fresh.
- Instagram carousel: Cover slide = the article headline. Slides 2–7 = one point each. Last slide = link in bio CTA.
- Facebook: Copy the introduction paragraph (first 100 words) + add "Full breakdown at techai.pk → link in bio"
- TikTok: Screen record yourself reading the key insight section. Or use the article's step-by-step as a script.
- Reddit: Find a thread in the last 2 weeks asking the exact question your Lab Note answers. Write a 5-sentence reply and link the article at the end.
- Adaptation rule: The Lab Note is the detailed version. Each platform gets a specific angle, not a summary.

**2. LinkedIn Post → 5 Platform Pieces**

Adaptation rules:
- LinkedIn → Instagram: Cut to the top 3 points. Add a visual graphic (quote or diagram). Shorten CTA to "Save this."
- LinkedIn → Facebook: Direct copy-paste usually works. Facebook audiences accept longer text.
- LinkedIn → TikTok: The hook line of the LinkedIn post becomes the video's first sentence on screen. Build 45-second video from the post's 3 main points.
- LinkedIn → Reddit: Find the thread this post would naturally answer. Strip all brand language. Post as a genuine answer with no link unless it's genuinely helpful.
- LinkedIn → Website: If the post gets 2x your average engagement, expand it into a full Lab Note within 7 days.

**3. Instagram Carousel → 4 Platform Pieces**

Adaptation rules:
- Instagram carousel → LinkedIn: Rewrite as a text-only numbered list. LinkedIn carousels work but text posts often outperform them for Abdul's content type.
- Instagram carousel → Facebook: Direct repost of the carousel. Facebook supports multi-image posts.
- Instagram carousel → TikTok: Each carousel slide becomes one screen-of-text in a TikTok image slideshow. Add music (use TikTok's commercial sound library). Total video: 10–15 seconds.
- Instagram carousel → Website: The carousel's full content is already a structured outline. Add 50 words of context per slide → Lab Note draft complete.

**4. TikTok Video → 4 Platform Pieces**

Adaptation rules:
- TikTok → Instagram Reel: Direct repost. Remove TikTok watermark first (use Snaptik.app for free). Write new Instagram caption.
- TikTok → LinkedIn: Post the video as a native LinkedIn video. LinkedIn penalizes TikTok watermarks — remove first.
- TikTok → Facebook: Share directly from TikTok or re-upload the file. Facebook Reels picks it up.
- TikTok → Reddit: Transcribe the video (use Claude or Whisper). Post the text content as a Reddit comment or post in relevant subreddit.

**5. Workshop Insight → 5 Platform Pieces**

Adaptation rules:
- The raw workshop material: what problem did participants have? What was the aha-moment?
- LinkedIn: "I ran a workshop for [N] [audience] yesterday. Here's the one thing that surprised everyone:" → share the insight.
- Instagram: Behind-the-scenes photo from setup + caption about what was covered.
- Facebook: Longer debrief for community-building. Share 3 things participants learned.
- TikTok: "I just taught [audience] this one workflow. Here's the 60-second version:" → screen recording.
- Reddit: Use workshop questions as sourcing for answers. The most common question asked = perfect Reddit post.

---

## SECTION 5: GRAPHIC TEMPLATE SYSTEM

### 5.1 Brand Variables (set these in Canva Brand Kit, never deviate)

```
Primary green:   #15573D
Warm white:      #FBFBFD
Near-black:      #1D1D1F
Accent gray:     #6E6E73
Light border:    #D2D2D7

Headline font:   Fraunces (Italic weight for emphasis)
Code font:       JetBrains Mono (for any code snippets, URLs, handles)
Body font:       Inter or system sans (Canva: use "Inter" — closest match)

Logo: Abdul. wordmark with green accent dot
Handle: @techai.pk (always JetBrains Mono, always bottom-right corner)
```

---

### 5.2 Template Specifications

**Template 1: LinkedIn Text-Image Post (1200×627)**

Purpose: Quote, insight, or single statistic  
Layout: Split — 60% text area left, 40% visual/color block right  
Left area: Headline in Fraunces 48pt, body in Inter 22pt, max 40 words total  
Right area: Forest green (#15573D) block with white abstract shape or simple diagram  
Bottom strip (full width, 40px): Warm white with "@techai.pk" right-aligned in JetBrains Mono 16pt  
Vary per post: headline text, background accent color (green → occasional warm gray for contrast)  
Keep constant: logo position (top-left), handle (bottom-right), border radius (12px), font stack  

**Template 2: Instagram Single Post (1080×1080)**

Purpose: Single tip or insight  
Layout: Centered, text-dominant with subtle background texture  
Background: Warm white (#FBFBFD) with very light green tint on top 30%  
Headline: Fraunces 72pt, centered, max 6 words, color #1D1D1F  
Subtext: Inter 28pt, centered, max 20 words, color #6E6E73  
Bottom: Green divider line (4px) + "@techai.pk" in JetBrains Mono  
Vary per post: headline text, whether to include a supporting icon (use Canva's minimal icon set)  
Keep constant: padding (80px all sides), font sizes, logo top-left 32pt  

**Template 3: Instagram Carousel Cover (1080×1080)**

Purpose: Series opener — must convey what the series is about  
Layout: Full-bleed forest green background  
Series number tag: "01" or "Part 1" in JetBrains Mono, white, top-left  
Headline: Fraunces 80pt, white, left-aligned, max 5 words  
Subtitle: Inter 32pt, white at 70% opacity, max 12 words  
Bottom-right: "Swipe →" in Inter 24pt, white, with right-arrow icon  
Handle: JetBrains Mono 20pt, white, bottom-left  
Vary: headline text, series number  
Keep constant: green background, font hierarchy, swipe indicator  

**Template 4: Instagram Carousel Slide (1080×1080)**

Purpose: Content slides 2 through N-1  
Layout: Warm white background  
Slide number: JetBrains Mono 20pt, forest green, top-left  
Slide title: Fraunces 56pt, #1D1D1F, left-aligned  
Body: Inter 28pt, #1D1D1F, left-aligned, max 35 words  
Code snippets (if applicable): JetBrains Mono 24pt on light gray background (#F5F5F7) block  
Progress indicator: small dots or numbers at bottom (Canva element)  
Bottom: handle right-aligned  
Vary: slide number, title, body text, code block (optional)  
Keep constant: all sizes, padding (60px), colors  

**Template 5: Instagram Reel / TikTok Cover (1080×1920)**

Purpose: Vertical thumbnail for video content  
Layout: Bottom 40% text on dark overlay, top 60% for screenshot or visual  
Text area: Semi-transparent near-black overlay (#1D1D1F at 85% opacity)  
Headline: Fraunces 72pt, white, left-aligned, bottom of overlay, max 5 words  
Label: JetBrains Mono 24pt, forest green, above headline (e.g., "Tutorial" or "Workflow")  
Handle: JetBrains Mono 20pt, white 70%, very bottom  
Vary: screenshot image in top 60%, headline text, label  
Keep constant: overlay opacity, font sizes, handle position  

**Template 6: Facebook Post (1200×630)**

Use LinkedIn template (1200×627) — same proportions, essentially identical.  
Only change: export at correct size. Facebook and LinkedIn graphics are interchangeable.  

**Template 7: TikTok Image Slide (1080×1920)**

Purpose: Text-heavy slides for TikTok image slideshow posts  
Layout: Full-bleed forest green OR warm white alternating  
Text: Fraunces 96pt headline, Inter 40pt body  
Max 20 words per slide — this must be readable at normal phone size in < 3 seconds  
Handle: bottom-right, JetBrains Mono 24pt  
Vary: background color alternates between slides, text  
Keep constant: padding (80px), font sizes  

**Template 8: Twitter/X Card (1200×675)**

Purpose: Article announcements, thread starters  
Layout: Identical to LinkedIn template — same dimensions, same layout logic  
Optional: Add "Thread 🧵" label in top-right for thread posts  

---

### 5.3 Canva Workflow Tips

- Name every template with a prefix: `[TK] LinkedIn Quote`, `[TK] IG Carousel Cover`, etc. ([TK] = Template)
- Never edit the master template directly — always duplicate first
- Create a Canva folder: `techai.pk / Templates / Active`
- Export all graphics at 2x — Instagram and LinkedIn both show compressed images, so export high-res

---

## SECTION 6: N8N / MAKE AUTOMATION WORKFLOWS

### 6.1 Workflow 1: RSS-to-Social (Lab Note Auto-Announcement)

**Trigger:** New post published at techai.pk/lab (RSS feed)  
**Result:** Announcement posts drafted and sent to LinkedIn + Facebook automatically  
**Tools:** n8n + Anthropic API + Buffer API (or Metricool API)

**Step-by-step n8n logic:**

```
Node 1: RSS Feed Trigger
  - Feed URL: https://techai.pk/feed.xml
  - Poll interval: every 30 minutes
  - Filter: only trigger on new items (check guid)

Node 2: Set Variables
  - article_title: {{$json.title}}
  - article_url: {{$json.link}}
  - article_excerpt: {{$json.contentSnippet}} (first 300 chars)
  - published_date: {{$json.pubDate}}

Node 3: HTTP Request → Anthropic API (claude-3-5-sonnet-20241022)
  - Method: POST
  - URL: https://api.anthropic.com/v1/messages
  - Headers: x-api-key, anthropic-version, content-type
  - Body (JSON):
    {
      "model": "claude-3-5-sonnet-20241022",
      "max_tokens": 500,
      "messages": [{
        "role": "user",
        "content": "Write a LinkedIn announcement post for this new article by Abdul Wahab of techai.pk. Voice: direct, no hype, practical. Title: {{article_title}}. Excerpt: {{article_excerpt}}. URL: {{article_url}}. Structure: 1 hook line (10 words max) + 2-3 sentence summary of what readers will learn + CTA: 'Full breakdown at techai.pk'. Add 3 hashtags at end. Max 120 words."
      }]
    }

Node 4: Parse Response
  - Extract: {{$json.content[0].text}}
  - Store as: linkedin_post_text

Node 5: IF Node — check if post text exists (error handling)

Node 6: HTTP Request → Buffer API
  - POST to /v1/profiles/[PROFILE_ID]/updates/create
  - Body: {text: {{linkedin_post_text}}, scheduled_at: NOW + 2 hours}
  - Do same for Facebook profile

Node 7: Telegram Notification (optional)
  - Send message to your personal Telegram bot:
    "New Lab Note published and scheduled to post in 2 hours: {{article_title}}"
```

**Cost estimate:** Each trigger uses ~800 tokens (Anthropic). At claude-3-5-sonnet pricing (~$3/1M input), this costs roughly $0.002 per article. Negligible.

---

### 6.2 Workflow 2: Engagement Monitoring + Reply Draft

**Trigger:** New comment on LinkedIn or Instagram (via monitoring)  
**Result:** WhatsApp/Telegram notification + AI-drafted reply suggestion  
**Tools:** n8n + Claude API + Telegram bot

**Limitation note:** LinkedIn and Instagram restrict comment webhooks to approved apps. Practical workaround: use a polling approach (check every 30 minutes) rather than real-time webhooks.

```
Node 1: Schedule Trigger
  - Every 30 minutes, 7am–10pm PKT

Node 2: HTTP Request → LinkedIn API (or Instagram Graph API)
  - Fetch recent comments on last 7 days of posts
  - Filter: only new comments since last check (store last_checked timestamp in n8n static data)

Node 3: Loop over new comments

Node 4: Anthropic API — draft reply
  - Prompt: "Draft a brief, genuine reply to this comment on Abdul Wahab's LinkedIn post about [topic]. Comment: {{comment_text}}. Rules: 1-2 sentences max, conversational, ask a follow-up question if appropriate, no marketing language. Abdul's tone: like a smart friend, direct."

Node 5: Telegram Message
  - Message format:
    "New comment on [platform] post '[post_title]':
    {{commenter_name}}: {{comment_text}}
    
    Suggested reply:
    {{ai_reply}}
    
    [Reply directly in the app]"
```

---

### 6.3 Workflow 3: Weekly Content Performance Report

**Trigger:** Monday 9:00am PKT (cron: `0 4 * * 1` in UTC)  
**Result:** Email report with last week's performance summary  
**Tools:** n8n + Metricool API (or native platform APIs) + Resend

```
Node 1: Schedule Trigger
  - Cron: 0 4 * * 1 (Monday 9am PKT = 4am UTC)

Node 2–6: HTTP Requests (parallel)
  - Fetch LinkedIn analytics: impressions, engagement, follower change (7-day)
  - Fetch Instagram analytics: reach, saves, profile visits (7-day)
  - Fetch Facebook analytics: reach, engagement (7-day)
  Note: Metricool API simplifies this into one call if you use their Pro tier

Node 7: Aggregate Data
  - Compile into a summary object with top post per platform

Node 8: Anthropic API — generate insights
  - Prompt: "Analyze this week's social media data for techai.pk and give Abdul 3 actionable observations in plain English. Data: [paste aggregated stats]. Rules: be direct, tell him what worked and what didn't, recommend one change for next week. Max 120 words."

Node 9: Resend Email
  - To: aidevabdul@gmail.com
  - Subject: techai.pk Weekly Recap — [Date]
  - Body: HTML email with stats table + AI insight section
```

---

### 6.4 Workflow 4: Batch Caption Generator (Google Sheets → Captions)

**Input:** Google Sheet with 20 topic ideas  
**Output:** LinkedIn, Instagram, and TikTok captions written back to the same sheet  
**Tools:** n8n + Google Sheets + Anthropic API

**Google Sheet structure:**

| Column A: Topic | Column B: Pillar | Column C: Audience | Column D: LinkedIn Caption | Column E: Instagram Caption | Column F: TikTok Hook |
|---|---|---|---|---|---|

**n8n workflow:**

```
Node 1: Manual Trigger (run once per month)

Node 2: Google Sheets — Read Rows
  - Sheet: "Content Calendar [Month]"
  - Read rows where Column D is empty (not yet generated)

Node 3: Loop over rows

Node 4: Anthropic API — LinkedIn caption
  - System prompt: "You write LinkedIn posts for Abdul Wahab of techai.pk. Voice: direct, practical, teacher-mode, no hype. Max 200 words. Hook (10 words) + 3–5 numbered points + one CTA. 3 hashtags at end."
  - User prompt: "Topic: {{row.topic}}. Audience: {{row.audience}}. Pillar: {{row.pillar}}. Write the LinkedIn post."

Node 5: Anthropic API — Instagram caption
  - System prompt: "You write Instagram captions for Abdul Wahab of techai.pk. 125 chars must work as standalone hook. Body 3–5 paragraphs. End with 'Save this.' or 'Link in bio.' 10 hashtags after line break. Max 3 emojis."
  - User prompt: "Topic: {{row.topic}}. Write the Instagram caption."

Node 6: Anthropic API — TikTok hook
  - System prompt: "Write a TikTok opening hook for Abdul Wahab. First 3 seconds. Creates knowledge gap or shows surprising result. Max 15 words. Do not start with 'Hey guys' or 'Today'."
  - User prompt: "Topic: {{row.topic}}. Write the hook line and a 5-point bullet script (each point = 1 screen, max 10 words per point)."

Node 7: Google Sheets — Update Row
  - Write LinkedIn caption → Column D
  - Write Instagram caption → Column E
  - Write TikTok hook + script → Column F

Node 8: Wait 2 seconds (rate limiting)
  - Loop back to Node 3 for next row
```

**System prompt for consistent voice across all nodes:**

```
You are the content assistant for Abdul Wahab of techai.pk. 

PERSONA: Abdul is a direct, practical AI educator in Pakistan. He teaches agentic AI workflows, Python for non-programmers, and social media marketing with AI. He writes like a smart friend explaining things over chai — no corporate speak, no hype, no fluff.

NEVER use: "game-changer", "unlock", "leverage", "synergy", "revolutionize", "unleash", "powerful", "robust", "seamlessly"

ALWAYS: Lead with the practical application. One clear CTA at the end. Use Pakistani context when relevant.

FORMAT: Return only the caption text, no preamble like "Here's your caption:" or "Sure!"
```

---

## SECTION 7: LEAD GENERATION INTEGRATION

### 7.1 The Social → Website → Booking Funnel

**Content types ranked by website click-through rate (highest to lowest):**

1. Carousels with "Full template at techai.pk → link in bio" (carousel drives saves + visits)
2. Tool comparison posts with "Full breakdown with pricing → link in bio"
3. Personal case study posts ("I helped a client do X — here's how → case study on my site")
4. Educational threads with "I wrote the complete guide → link in bio"
5. Opinion posts (low click-through — good for awareness, not traffic)

**The funnel in practice:**
```
Instagram Carousel (teaches workflow) 
  → "Get the n8n template at techai.pk → link in bio"
    → Link-in-bio page
      → Workflow Audit Bot or Workshop Inquiry page
        → Discovery call booked
```

---

### 7.2 UTM Parameter Strategy

Tag every link posted to social media. This is non-negotiable for knowing which platform drives leads.

**UTM format:**

```
techai.pk/lab/audit?utm_source=[platform]&utm_medium=social&utm_campaign=[content-type]

Examples:
techai.pk/lab/audit?utm_source=instagram&utm_medium=social&utm_campaign=carousel
techai.pk/lab/audit?utm_source=linkedin&utm_medium=social&utm_campaign=text-post
techai.pk/contact?utm_source=tiktok&utm_medium=social&utm_campaign=tutorial
```

**Shortlink approach:** Use a free Dub.co or Bitly account to shorten UTM links. Create a custom shortlink for each platform's link-in-bio that you update monthly:

- `techai.pk/go/instagram` → redirects to current UTM-tagged link-in-bio destination
- `techai.pk/go/linkedin` → redirects to contact page UTM-tagged

This way you never have to update the links you post — only the redirect destination.

---

### 7.3 Link-in-Bio Page Structure

Abdul's link-in-bio (Instagram + TikTok) should have exactly 4 links, in this order:

```
1. Book a Discovery Call           → cal.com/techai (UTM-tagged)
2. Try the Workflow Audit Bot      → techai.pk/lab/audit
3. Request a Workshop              → techai.pk/workshops#inquiry
4. Free Resource (lead magnet)     → techai.pk/[lead-magnet-slug]
```

Use a simple custom page at `techai.pk/links` rather than Linktree — keeps users on your domain, improves SEO, and you control the design.

**Lead magnet options (pick one for Month 1):**

- "5 n8n Workflows for Pakistani Businesses" (PDF) — high perceived value for Operators
- "The AI Tool Starter Kit for Educators" (Notion template) — high value for Communities
- "Python Automation Cheatsheet" (1-page PDF) — high value for Teams

Build the lead magnet in Canva or Notion, gate it with an email capture form (use Resend to deliver it automatically).

---

### 7.4 Workflow Audit Bot as Social CTA

The `/lab/audit` bot is the best CTA for technical content because:
- It provides immediate value (not just "sign up for my newsletter")
- It qualifies the lead (someone who completes an audit is a warm lead)
- It captures email naturally within the audit flow
- It's a demonstration of Abdul's AI skills (meta-credibility)

**CTA language to use in posts:**

For Operators: "Not sure which workflows to automate first? The Audit Bot at techai.pk will map it out for you in 5 minutes."

For Teams: "Want to know which AI tools are worth adopting for your team? Try the free audit at techai.pk/lab/audit"

For Communities: "I built an AI tool that audits your workflow and tells you where automation would save the most time. Free at techai.pk → link in bio"

---

### 7.5 Conversion Metrics to Track

Set up these funnels in Plausible (already in the tech stack):

| Metric | Target (Month 2) | Target (Month 4) |
|--------|-----------------|-----------------|
| Social → website clicks/month | 200 | 600 |
| Website → audit bot starts | 15% of visitors | 20% of visitors |
| Audit bot → email captured | 40% of starts | 50% of starts |
| Email captured → discovery call booked | 10% | 15% |

At Month 4 targets: 600 visitors → 120 audit starts → 60 emails → 9 calls/month. At a reasonable close rate and pricing (Rs. 50,000+ consulting engagement), 2–3 clients/month is achievable from organic social alone.

---

## SECTION 8: GOOGLE MY BUSINESS AUTOMATION

### 8.1 Scheduling GMB Posts in Batch

Google My Business (now Google Business Profile) posts have a 7-day auto-expiry for "What's New" posts. Offer and Event posts persist until end date.

**Batch scheduling via Metricool:**
- Metricool supports GMB scheduling on Starter plan ($18/month)
- Schedule "What's New" posts every 7 days (Mon, Wed) to maintain fresh profile
- Schedule at least 2 GMB posts per week for consistent visibility

**Content for GMB posts (different from social media):**
- Announcements of new Lab Notes
- Workshop availability announcements ("Accepting 5 teams for June AI Workshop — link to book")
- Tip of the week (same content as Instagram, but GMB audience is people searching for your services, not followers)

---

### 8.2 Photo Upload Schedule

Google rewards GBP profiles with regular photo updates.

| Week | Photo to upload |
|------|----------------|
| Week 1 | Team/workspace photo (your setup, even solo) |
| Week 2 | Workshop screenshot or Zoom screenshot with participant permission |
| Week 3 | Screenshot of a workflow you built (counts as "product" photo) |
| Week 4 | Profile or headshot update (quarterly) |

Photos per month: 4 minimum. GMB profiles with regular photos get 42% more direction requests (Google's own data).

---

### 8.3 Review Request Automation (Post-Workshop)

After every workshop or training session, send a review request within 24 hours.

**Automated flow using n8n:**

```
Trigger: Manually or via Cal.com webhook when event marked "completed"
Action 1: Wait 4 hours (give time for the session to wrap up)
Action 2: Send WhatsApp message via WhatsApp Business API:
  "Assalamu alaikum [Name], jazakallah for joining today's session! 
  If you found it valuable, a quick Google review would mean a lot and 
  help others find the workshop. Takes 30 seconds: [GBP Review Link]"
Action 3: If no review in 72 hours, send one follow-up via email using Resend
```

**Your GBP review link:** Get it from Google Business Profile → Get more reviews → Share review link. Shorten with `techai.pk/review`.

---

### 8.4 Monthly GMB Performance Review Checklist

Run this in 15 minutes on the first Monday of each month alongside the main analytics review:

- [ ] Check GBP Insights: how many people searched "techai" vs found by category
- [ ] Review total phone calls and direction requests (proxy for local intent)
- [ ] Read any new reviews and respond within 24 hours (even 5-star reviews get a response)
- [ ] Check Q&A section — add a new Q&A entry if relevant question came up in workshop
- [ ] Verify profile info is current (phone, hours, website, services list)
- [ ] Add 4 new photos this month? (check)

---

## SECTION 9: 90-DAY ANALYTICS REVIEW TEMPLATE

Run this on the first Monday of each month. Takes 45 minutes.

---

### Monthly Analytics Review — [Month] [Year]

**Date completed:** \_\_\_\_\_\_\_\_  
**Reviewed by:** Abdul Wahab

---

#### 1. Follower Growth

| Platform | Start of Month | End of Month | Change | % Change |
|----------|---------------|-------------|--------|---------|
| LinkedIn | | | | |
| Instagram | | | | |
| Facebook | | | | |
| TikTok | | | | |
| Reddit Karma | | | | |

**Observation:** Which platform grew fastest? Was growth organic or driven by a specific post?

---

#### 2. Top 5 Posts (by Reach)

| Post | Platform | Format | Reach | Engagement Rate | Saves/Shares | CTA Clicks |
|------|----------|--------|-------|----------------|-------------|-----------|
| 1. | | | | | | |
| 2. | | | | | | |
| 3. | | | | | | |
| 4. | | | | | | |
| 5. | | | | | | |

**Pattern:** What do the top posts have in common? (format, topic, audience, time of day)

---

#### 3. Bottom 3 Posts (by Engagement)

| Post | Platform | Why it underperformed (hypothesis) |
|------|----------|------------------------------------|
| 1. | | |
| 2. | | |
| 3. | | |

---

#### 4. Lead Attribution

| Source | Website visits | Audit bot starts | Emails captured | Calls booked |
|--------|---------------|-----------------|----------------|-------------|
| Instagram | | | | |
| LinkedIn | | | | |
| Facebook | | | | |
| TikTok | | | | |
| Reddit | | | | |
| Direct | | | | |
| **Total** | | | | |

**Plausible URL to check:** `techai.pk/analytics` → filter by UTM source

---

#### 5. Content Type Performance

| Format | Posts published | Avg reach | Avg engagement rate | Best post |
|--------|----------------|-----------|--------------------|-----------| 
| Text only | | | | |
| Single image | | | | |
| Carousel | | | | |
| Video/Reel | | | | |

---

#### 6. Decision Gates

Answer each with Yes / No / Not enough data yet:

- [ ] Is any platform growing faster than 15%/month? → **Double posting frequency there**
- [ ] Is any platform flat after 60 days of consistent posting? → **Cut frequency in half, improve quality**
- [ ] Did carousels outperform single images 2:1 or more? → **Shift 50% of graphics to carousel format**
- [ ] Is LinkedIn driving more calls than Instagram? → **Prioritize LinkedIn captions in batch session**
- [ ] Did any single post 3x your average reach? → **Repurpose it as a carousel or video next week**
- [ ] Did the Audit Bot generate any paid leads this month? → **Add bot CTA to 25% of posts**

---

#### 7. Next Month Decisions

**Continue doing:**

**Stop doing:**

**Test next month:**

**Budget change needed?** (See Section 10 tier thresholds)

---

## SECTION 10: TOOL BUDGET BREAKDOWN

### Month 1: Bootstrap — $0–30/month

| Tool | Purpose | Cost | Notes |
|------|---------|------|-------|
| Claude.ai Pro | Caption writing, ideation | $20/month | Essential — use Projects feature |
| Canva Free | Graphics | $0 | Limited resize, but workable |
| Metricool Free | Scheduling (1 brand, unlimited posts) | $0 | Covers all 6 platforms |
| n8n Cloud Free | Automation (5 workflows, 20 executions/day) | $0 | Enough for Month 1 workflows |
| Google Sheets | Content calendar, caption tracking | $0 | |
| Plausible Analytics | Website analytics (already in stack) | $0 | Via techai.pk setup |
| OBS Studio | Screen recording | $0 | Open source |
| CapCut | Video editing (mobile) | $0 | Free tier sufficient |
| **Total** | | **$20/month** | |

Constraint at this tier: Canva's free plan doesn't allow template resizing between formats. Workaround: build separate templates for each size rather than resizing.

---

### Month 2–3: Growth — $30–80/month

| Tool | Purpose | Cost | Upgrade trigger |
|------|---------|------|----------------|
| Claude.ai Pro | Caption writing, ideation | $20/month | Carried from Month 1 |
| Canva Pro | Full template library, Brand Kit, resize | $13/month | Upgrade when you have 5+ active templates |
| Metricool Starter | AI captions, best-time data, deeper analytics | $18/month | Upgrade when scheduling takes > 2 hrs/month |
| n8n Cloud Starter | More workflows, higher execution limits | $20/month | Upgrade when you've built 3+ active workflows |
| **Total** | | **$71/month** | |

At this tier: fully automated Lab Note announcements, weekly performance reports, batch caption generation via Google Sheets.

---

### Month 4+: Scale — $80–200/month

Add these tools when revenue justifies ($1000+/month from consulting):

| Tool | Purpose | Cost | Notes |
|------|---------|------|-------|
| All Month 2–3 tools | (carried) | $71/month | |
| ElevenLabs Starter | AI voiceover for TikTok/tutorials | $5/month | 30k characters ≈ 15 videos |
| Descript Creator | Video editing with transcript editing | $24/month | Faster than CapCut for long-form |
| Anthropic API (direct) | n8n workflows at scale | ~$10/month | Based on usage; cheaper than Claude.ai for automation |
| **Total** | | **~$110/month** | |

At this tier: video content pipeline is operational, all automation workflows are running, analytics are fully attributing leads to source.

---

### Budget Upgrade Decision Rules

- Upgrade Canva Free → Pro when: you've built all 8 templates and resizing takes extra time
- Upgrade Metricool Free → Starter when: scheduling manually takes more than 90 minutes/month
- Upgrade n8n Free → Starter when: you've hit the 5-workflow limit or 20-execution/day cap
- Upgrade to ElevenLabs when: you're posting video content at least twice per week
- Never upgrade Hootsuite or Sprout Social — both are overpriced for a solo operator at Abdul's stage

---

## Quick-Start Checklist (Week 1)

Complete these in order before running the first batch session:

- [ ] Create Claude.ai Pro account → create techai.pk Project → paste persona instructions from Section 3
- [ ] Create Metricool account → connect LinkedIn, Instagram, Facebook, TikTok, Reddit, GMB
- [ ] Create Canva account → set up Brand Kit (colors, fonts, logo) → build 3 core templates (LinkedIn, IG single, IG carousel slide)
- [ ] Create Google Sheet "Content Calendar May 2026" with columns from Section 6.4
- [ ] Install n8n (cloud or self-hosted) → set up Anthropic API credentials
- [ ] Create UTM shortlinks for each platform (techai.pk/go/instagram, etc.)
- [ ] Run first batch ideation prompt (Section 3.6) with May's theme
- [ ] Generate first 10 captions using LinkedIn and Instagram prompts
- [ ] Schedule first 2 weeks in Metricool
- [ ] Set phone reminder: daily 7:30am engagement block

---

*Document version: 1.0 | Created: 2026-05-15 | Next review: 2026-06-15*
