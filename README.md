# fatfat-remotion-example

A video editing project that uses [Remotion](https://www.remotion.dev) —
a React-based video rendering framework — so we can build videos for
social media by writing code.

**You do not need to be a developer to use this.** The two most important
things to understand are:

1. **Photos and videos you want to edit go in the `public/` folder.** The
   code refers to them by filename.
2. **Rendering turns the React code into a real `.mp4` file** that lives
   inside the `samples/` folder (or the `out/` folder if you render on
   your own machine).

---

## 📺 Where is the actual video?

The sample video is **already rendered and committed** to this repo.
Click these files on GitHub to preview them right in your browser:

| File | What it is |
|---|---|
| `samples/hello-world.mp4` | A 7-second demo animation — GitHub plays mp4s inline |
| `samples/hello-world-thumbnail.png` | A single frame from the video |

> GitHub will render an mp4 in the file viewer. Just click the file in
> the repo tree and press play.

The **PreschoolReel** video is **not rendered yet** — it needs the two
preschool photos added to the `public/` folder first. See below.

---

## ❓ Why can't I see the video inside Claude Code's chat?

Claude Code on the web runs in a sandboxed cloud environment. It's a
**terminal and file editor**, not a media player. It can display images
inline (so you can paste photos and Claude can see them), but it
**cannot play videos or audio inside the chat**.

The workflow is instead:
1. You tell Claude what video you want.
2. Claude writes the code and renders the `.mp4`.
3. The `.mp4` is committed to the repo.
4. **You open the repo on GitHub and play the video there** (or
   download it to your computer).

---

## 📎 Why can I only attach some file types to chat?

Claude Code's chat attachment box only accepts **images** (`.jpg`,
`.jpeg`, `.png`, `.gif`, `.webp`) and a few document formats (`.pdf`,
`.txt`, `.md`). It **does not accept**:

- ❌ Video files (`.mp4`, `.mov`, `.avi`, `.mkv`)
- ❌ Audio files (`.mp3`, `.wav`, `.m4a`)
- ❌ Large or raw files (`.heic`, RAW camera formats, etc.)

This is a chat limitation, not a project limitation. Your project can
absolutely _use_ videos and audio — they just need to get into the
`public/` folder via a different route.

---

## 📤 How do I upload photos or videos I want edited?

Pick **one** of these three options. **Option 1 is the easiest** if you
are not a developer and you are using Claude Code on the web.

### Option 1 — Upload directly to GitHub (easiest, no install)

1. Open the repo on GitHub in your browser:
   `https://github.com/peswine91-eng/fatfat-test`
2. Click the `public/` folder.
3. Click the **"Add file" → "Upload files"** button.
4. Drag the photos or videos in from your computer. You can drop **any
   file size and any format GitHub accepts** (images, mp4, mov, mp3,
   wav — all fine).
5. At the bottom, type a short message like _"add preschool photos"_,
   then click **"Commit changes"**.
6. Back in Claude Code, say _"I've uploaded new files to public/,
   please rerender"_. Claude will pull them and render the video.

> ⚠️ Rename your files to exactly what the code expects. For the
> preschool reel the code looks for `public/scene1.jpg` and
> `public/scene2.jpg`. If your files are called `IMG_1234.jpeg`, use
> GitHub's rename button after upload.

### Option 2 — Paste photos into Claude Code chat

This works **only for images** and **only one-way** — you show Claude
the image in chat so it can _see_ it, but the file itself is never saved
to disk. Claude can describe it, position it in the layout, and plan the
edit, but it cannot render that image into your video. You still need
Option 1 or 3 to get the actual file into `public/`.

### Option 3 — Clone the repo to your own computer (most flexible)

If you're comfortable installing software, this gives you instant video
previews without any sandbox limits.

```bash
# one-time setup
git clone https://github.com/peswine91-eng/fatfat-test.git
cd fatfat-test
npm install

# drop your photos into public/ using your normal file manager

# launch the preview studio
npm start
```

Remotion Studio opens at `http://localhost:3000` in your browser. You
pick a composition from the list on the left and it plays instantly in
a scrubbable timeline. Editing the code auto-refreshes the preview.

---

## 🎬 The two videos in this project

### 1. `HelloWorld` (1920×1080, horizontal, 7 seconds)

A simple demo showing "Hello Remotion!" with a bouncy spring animation,
an accent bar, and a twinkling starfield. **Already rendered** — see
`samples/hello-world.mp4`.

### 2. `PreschoolReel` (1080×1920, vertical for Instagram Reels, 18 s)

A "POV: day at a Singapore preschool" reel targeted at parents. Six
beats: hook → circle time → suspense → watermelon reveal → fact card →
follow CTA. Uses the two preschool photos, Ken Burns zoom, floating
emojis, a progress bar and spring-powered text pop-ins.

**Needs photos before rendering.** Upload via **Option 1** above:
- `public/scene1.jpg` — the first photo (teacher holding the whole watermelon)
- `public/scene2.jpg` — the second photo (watermelon split in halves)

Then ask Claude to render it.

---

## 🛠 How to render a video (for reference)

```bash
# render HelloWorld
npx remotion render src/index.ts HelloWorld out/hello-world.mp4

# render PreschoolReel (needs public/scene1.jpg and public/scene2.jpg)
npx remotion render src/index.ts PreschoolReel out/preschool-reel.mp4
```

The output mp4 lands in `out/`. To make the sample visible on GitHub,
copy it into `samples/` and commit.

This project is configured to work in **both** your local machine and
Claude Code's remote sandbox. The `remotion.config.ts` file
auto-detects the sandbox's headless Chromium binary so renders succeed
without needing to download Chrome.

---

## 🙋 Common questions

**Q: I pasted a photo in chat but Claude can't put it in the video.**
A: Correct. Pasting in chat just shows Claude the image visually — it
never hits the filesystem. Use Option 1 to upload it to `public/`.

**Q: Why is the mp4 committed to git? Isn't that bad practice?**
A: Normally, yes — video files bloat git history. We're keeping one or
two small sample mp4s in `samples/` on purpose so you can **see** the
result without needing to render locally. If the repo grows, switch to
[git-lfs](https://git-lfs.com/) or upload finished renders to YouTube /
Google Drive instead.

**Q: How do I edit the copy/text/timing of a video?**
A: Ask Claude in plain English, e.g. _"change the hook text to X"_ or
_"make the subtitle appear 1 second later"_. Claude will edit the
corresponding `.tsx` file in `src/` and re-render.

**Q: How do I add music?**
A: Upload an mp3 to `public/` via Option 1, then ask Claude _"add this
track as background music, fading in over the first second"_. Claude
will wire up Remotion's `<Audio>` component.

**Q: Can I make a new video from scratch?**
A: Yes — just describe what you want. _"Make a 15-second birthday
announcement reel with these 3 photos"_ is all Claude needs.
