# Grain App - Weekly Sprint Checklist

Use this checklist to track progress each week. Copy the relevant week's checklist and mark off tasks as you complete them.

---

## WEEK 1: Foundation ✅

**Sprint Goal:** Project setup, data model, photo capture working

### Monday
- [ ] Create Xcode project (iOS 17+, SwiftUI, SwiftData)
- [ ] Configure project settings (bundle ID, team, capabilities)
- [ ] Set up project structure (folders: Models, Views, ViewModels, Services, Repositories)
- [ ] Initialize Git repository
- [ ] Create .gitignore (exclude .DS_Store, xcuserdata, etc.)
- [ ] First commit + push to GitHub
- [ ] Write README.md (project overview, how to run)

### Tuesday
- [ ] Design SwiftData model (DiaryEntry: id, date, photoFileName, noteText, createdAt, updatedAt)
- [ ] Create Repository protocol (DiaryRepository)
- [ ] Implement SwiftDataDiaryRepository
- [ ] Create file storage structure (Documents/Photos/YYYY/MM/)
- [ ] Write basic unit tests for repository

### Wednesday
- [ ] Create PhotoCaptureService (UIImagePickerController)
- [ ] Add camera permission to Info.plist (NSCameraUsageDescription)
- [ ] Implement camera permission request flow
- [ ] Build simple CameraView (tap button → open camera)
- [ ] Test camera on physical device

### Thursday
- [ ] Create PhotoStorageService (save UIImage as HEIC)
- [ ] Implement HEIC conversion (UIImage → Data)
- [ ] Implement save photo to disk (Documents/Photos/YYYY/MM/UUID.heic)
- [ ] Implement load photo from disk
- [ ] Integration: capture → save → create DiaryEntry
- [ ] Write unit tests (PhotoStorageService)

### Friday
- [ ] Test on physical iPhone
- [ ] Fix bugs from device testing
- [ ] Code review (self-review PR on GitHub)
- [ ] Clean up code, add comments where needed
- [ ] Sprint review (30 min): What worked? What didn't?
- [ ] Retrospective (30 min): Action items for next week

**Week 1 Deliverables:**
- [ ] Xcode project compiles and runs
- [ ] SwiftData model created and tested
- [ ] Can take photo with device camera
- [ ] Photo saves to local storage in HEIC format
- [ ] Git repo with clean commit history

---

## WEEK 2: Entry Creation & Timeline ✅

**Sprint Goal:** Create entry flow, timeline view showing entries

### Monday
- [ ] Create CreateEntryView UI (photo preview, TextEditor for note)
- [ ] Create CreateEntryViewModel
- [ ] Implement save entry logic (photo + note → repository)
- [ ] Wire up view to ViewModel
- [ ] Test entry creation flow

### Tuesday
- [ ] Implement one-entry-per-day validation (in repository)
- [ ] Show error alert if duplicate entry attempted
- [ ] Create CreateEntryUseCase (business logic layer)
- [ ] Implement note validation (max 1,000 chars)
- [ ] Write unit tests (use case, validation)

### Wednesday
- [ ] Create TimelineView (List or LazyVGrid)
- [ ] Create EntryRowView (cell: thumbnail, date, note preview)
- [ ] Create EmptyStateView ("Take your first photo!")
- [ ] Test timeline layout (empty state, 1 entry, 10 entries)

### Thursday
- [ ] Create TimelineViewModel
- [ ] Load entries from SwiftData (@Query, sorted by date descending)
- [ ] Implement image loading (AsyncImage)
- [ ] Add basic navigation (tap row → placeholder)
- [ ] Test with multiple entries

### Friday
- [ ] Integration testing (create entry → see in timeline)
- [ ] Fix bugs (if any)
- [ ] Polish UI (spacing, fonts, colors)
- [ ] Test on device
- [ ] Sprint review
- [ ] Retrospective

**Week 2 Deliverables:**
- [ ] Can create entry (photo + text note)
- [ ] Timeline view shows all entries in reverse chronological order
- [ ] One-entry-per-day validation works (show error if duplicate)
- [ ] Basic app flow works end-to-end (capture → create → view)

---

## WEEK 3: Detail View & Edit/Delete ✅

**Sprint Goal:** View, edit, delete entries

### Monday
- [ ] Create EntryDetailView UI (full photo, full note, date/time)
- [ ] Create ZoomablePhotoView (pinch-to-zoom with MagnificationGesture)
- [ ] Set up navigation (TimelineView → EntryDetailView)
- [ ] Test navigation flow

### Tuesday
- [ ] Create EntryDetailViewModel
- [ ] Load entry by ID
- [ ] Polish detail view layout (spacing, readability, typography)
- [ ] Test on device (light and dark mode)

### Wednesday
- [ ] Create EditEntryView (modal sheet with TextEditor)
- [ ] Create EditEntryViewModel
- [ ] Implement update entry logic (in repository)
- [ ] Wire up edit flow (detail → sheet → save → dismiss)
- [ ] Add "Edited on [date]" timestamp display

### Thursday
- [ ] Implement deleteEntry in repository (delete from DB + file)
- [ ] Add swipe-to-delete in TimelineView (.swipeActions)
- [ ] Add delete button in EntryDetailView
- [ ] Add confirmation alert ("Are you sure?")
- [ ] Test delete flow (both ways: swipe, button)
- [ ] Verify photo file is deleted from disk

### Friday
- [ ] Test all CRUD operations (Create, Read, Update, Delete)
- [ ] Test edge cases (delete last entry, edit empty note, etc.)
- [ ] Polish animations (delete animation, navigation transitions)
- [ ] Sprint review
- [ ] Retrospective

**Week 3 Deliverables:**
- [ ] Entry detail view fully functional
- [ ] Can edit entry text note
- [ ] Can delete entry (swipe-to-delete and detail button)
- [ ] All CRUD operations working smoothly

---

## WEEK 4: Settings, Branding, Dark Mode ✅

**Sprint Goal:** Settings screen, app icon, color scheme, dark mode

### Monday
- [ ] Create SettingsView UI (Form with sections)
- [ ] Create SettingsManager (UserDefaults wrapper)
- [ ] Add setting: Default camera (front/back)
- [ ] Add setting: Photo quality (high/medium)
- [ ] Test settings persistence

### Tuesday
- [ ] Add setting: App version (display only, read from Bundle)
- [ ] Add setting: Privacy Policy link (placeholder URL)
- [ ] Add setting: Contact Support link (mailto: or placeholder)
- [ ] Write privacy policy (simple, host on GitHub Pages or in-app)
- [ ] Add setting: iCloud Sync toggle (UI only, not functional yet)

### Wednesday
- [ ] Design app icon (Figma DIY or commission on Fiverr)
  - Option A: DIY (6 hours)
  - Option B: Hire ($100, brief designer, wait for delivery)
- [ ] Export app icon at 1024x1024px
- [ ] Generate all icon sizes (use Xcode or app icon generator)
- [ ] Add icon to Xcode project
- [ ] Define color scheme (primary, secondary, accent)

### Thursday
- [ ] Create Color assets in Xcode (semantic colors for light/dark mode)
- [ ] Apply branding throughout app (replace default colors)
- [ ] Update typography (SF Pro, consistent font weights)
- [ ] Define dark mode colors (semantic colors)
- [ ] Test all screens in dark mode (simulator)

### Friday
- [ ] Fix dark mode issues (text contrast, backgrounds)
- [ ] Visual polish (spacing, alignment, consistency)
- [ ] Test on device (light + dark mode)
- [ ] Sprint review
- [ ] Retrospective

**Week 4 Deliverables:**
- [ ] Settings screen functional (all settings work)
- [ ] App icon designed and added to project
- [ ] Cohesive color scheme applied throughout app
- [ ] Dark mode fully supported (all screens)

---

## WEEK 5: Onboarding & Performance ✅

**Sprint Goal:** Onboarding flow, performance optimization, UX polish

### Monday
- [ ] Design onboarding screens (3 pages)
  - Page 1: Welcome + value prop
  - Page 2: How it works
  - Page 3: Permissions request
- [ ] Create OnboardingContainerView (TabView with PageTabViewStyle)
- [ ] Create OnboardingPageView (reusable component)
- [ ] Test swipe navigation between pages

### Tuesday
- [ ] Implement first launch detection (UserDefaults: hasCompletedOnboarding)
- [ ] Show onboarding as .fullScreenCover on first launch
- [ ] Request camera permission during onboarding (Page 3)
- [ ] Add "Skip" button on each page
- [ ] Add "Get Started" button on final page
- [ ] Test onboarding flow (complete, skip, permissions)

### Wednesday
- [ ] Performance audit (Instruments: Time Profiler)
- [ ] Measure app launch time (goal: <2 seconds)
- [ ] Optimize launch time (lazy load views, defer heavy work)
- [ ] Measure timeline scrolling performance (goal: 60fps)
- [ ] Implement image caching (simple cache for thumbnails)
- [ ] Test with 100+ entries (create dummy data for testing)

### Thursday
- [ ] Memory profiling (Instruments: Allocations)
- [ ] Check for memory leaks (Instruments: Leaks)
- [ ] Fix memory leaks (if any)
- [ ] Optimize image loading (generate thumbnails for timeline)
- [ ] Test performance on iPhone SE (oldest supported device)
- [ ] Measure memory usage (goal: <100 MB with 100 entries)

### Friday
- [ ] UX polish pass (animations, transitions, haptics)
- [ ] Add subtle animations (button press, list item appear)
- [ ] Add haptic feedback (button tap, delete confirmation)
- [ ] Polish loading states (show spinner when loading)
- [ ] Sprint review
- [ ] Retrospective

**Week 5 Deliverables:**
- [ ] Onboarding flow complete (shown on first launch)
- [ ] App performs smoothly (60fps scrolling, <2s launch)
- [ ] Memory optimized (<100 MB)
- [ ] UX feels polished and professional

---

## WEEK 6: Testing & TestFlight ✅

**Sprint Goal:** Comprehensive testing, TestFlight beta submission

### Monday
- [ ] Accessibility audit (VoiceOver, Dynamic Type)
- [ ] Test with VoiceOver (all buttons labeled, navigation works)
- [ ] Test with Dynamic Type (large text, XL text)
- [ ] Fix accessibility issues (add labels, hints, improve contrast)
- [ ] Run through manual testing checklist (see DEVELOPMENT_PLAN)

### Tuesday
- [ ] Fix bugs found in manual testing (prioritize P0)
- [ ] Test edge cases (no entries, 1000+ entries, very long note)
- [ ] Test permissions (camera denied, re-request)
- [ ] Fix more bugs

### Wednesday
- [ ] Final UI polish (spacing, alignment, fonts)
- [ ] Test on multiple devices (if available: iPhone SE, iPhone 15 Pro)
- [ ] Prepare TestFlight build:
  - Bump version to 1.0.0
  - Set build number (1)
  - Archive app (Product → Archive)
- [ ] Upload to App Store Connect (Xcode Organizer → Distribute)
- [ ] Wait for processing (10-20 minutes)

### Thursday
- [ ] TestFlight: Create external testing group
- [ ] TestFlight: Write release notes (what to test)
- [ ] Recruit beta testers:
  - Friends/family (10-15)
  - Twitter (post "Looking for beta testers")
  - Reddit (r/iOSBeta, r/TestFlight)
- [ ] Create beta testing feedback form (Google Form)
- [ ] Set up Discord or WhatsApp group for testers
- [ ] Send TestFlight invites (target: 30-50 testers)

### Friday
- [ ] Monitor initial feedback (first few testers)
- [ ] Fix critical bugs (if any reported in first 24h)
- [ ] Start App Store prep (while testers test):
  - Draft App Store description
  - Research keywords (ASO)
  - Brainstorm screenshot ideas
- [ ] Sprint review
- [ ] Retrospective

**Week 6 Deliverables:**
- [ ] Feature-complete app
- [ ] All P0 features working
- [ ] TestFlight beta live
- [ ] 30-50 beta testers recruited and testing

---

## WEEK 7: Beta Testing & App Store Prep ✅

**Sprint Goal:** Fix bugs from beta, create App Store assets

### Monday
- [ ] Review beta tester feedback (Google Form, Discord, TestFlight)
- [ ] Prioritize bugs (P0 must fix, P1 nice to fix, P2 defer to v1.0.1)
- [ ] Fix P0 bugs from beta testing
- [ ] Fix P1 bugs (if time permits)

### Tuesday
- [ ] Fix more bugs (P0 and P1)
- [ ] Submit TestFlight build 2 (if needed, with bug fixes)
- [ ] Monitor feedback on build 2
- [ ] Continue fixing bugs

### Wednesday
- [ ] Create App Store screenshots (5-6 screenshots):
  - Screenshot 1: Hero (timeline view) "Your Daily Photo Diary"
  - Screenshot 2: Feature (camera view) "Capture Daily Moments"
  - Screenshot 3: Feature (settings) "Private & Local"
  - Screenshot 4: Feature (detail view) "Beautiful Timeline"
  - Screenshot 5: Social proof (if have reviews)
- [ ] Use Canva or Screenshot Studio (add text overlay)
- [ ] Export for 6.7" (iPhone 15 Pro Max) - required
- [ ] Export for 5.5" (iPhone 8 Plus) - optional but recommended

### Thursday
- [ ] Finalize App Store description:
  - Subtitle (30 chars): "Privacy-First Photo Diary"
  - Short description (170 chars)
  - Full description (4,000 chars max, focus on benefits)
  - Keywords (100 chars, comma-separated, no spaces)
- [ ] App Store metadata:
  - Support URL (can be GitHub or placeholder)
  - Privacy Policy URL (required, host on GitHub Pages)
  - Category: Photo & Video or Lifestyle
  - Age Rating: 4+ (complete questionnaire)
- [ ] Create press kit:
  - App icon (high-res PNG)
  - Screenshots (without device frames)
  - App description (short + long)
  - Press contact email

### Friday
- [ ] Draft ProductHunt post:
  - Tagline: "A privacy-first photo diary for iPhone"
  - Description: Problem, solution, features, pricing
  - Gallery: 4-6 screenshots
- [ ] Draft launch tweet (pinned tweet for launch day)
- [ ] Draft Reddit posts (3-4 subreddits: r/iOSapps, r/SideProject, etc.)
- [ ] Identify 10-20 press contacts (tech blogs, newsletters)
- [ ] Final TestFlight check (all critical bugs fixed?)
- [ ] Sprint review
- [ ] Retrospective

**Week 7 Deliverables:**
- [ ] All critical bugs from beta testing fixed
- [ ] Beta testers happy with stability and UX
- [ ] App Store screenshots complete (6.7" + 5.5")
- [ ] App Store description finalized
- [ ] Marketing materials ready (ProductHunt, tweets, Reddit posts)

---

## WEEK 8: App Store Submission & Launch 🚀

**Sprint Goal:** Submit to App Store, launch publicly

### Monday
- [ ] Final testing (smoke test on latest TestFlight build)
- [ ] Test on multiple devices (if available)
- [ ] Test all critical flows one more time
- [ ] Submit to App Store (App Store Connect):
  - Select build (latest TestFlight build)
  - Add screenshots (6.7" and 5.5")
  - Add description, keywords, metadata
  - Set pricing ($4.99 USD)
  - Set availability (all countries or select)
  - Submit for review
- [ ] Monitor submission status (wait for "Waiting for Review")

### Tuesday
- [ ] Finalize privacy policy (publish on GitHub Pages or website)
- [ ] Write FAQ document (5-10 common questions)
- [ ] Set up support email (support@grainapp.com or Gmail)
- [ ] Prepare email templates for common support requests:
  - How to use the app
  - Refund request
  - Bug report
  - Feature request

### Wednesday
- [ ] Monitor App Review status (check App Store Connect)
- [ ] If approved: Move to Thursday tasks early
- [ ] If in review: Work on marketing prep
- [ ] If rejected: Fix issues immediately, resubmit
- [ ] Final marketing prep:
  - ProductHunt post ready (schedule for Thursday 12:01 AM PST)
  - Launch tweet ready (with App Store link placeholder)
  - Reddit posts ready
  - Press emails ready (send on launch day)

### Thursday - LAUNCH DAY! 🎉
- [ ] 8:00 AM: Release app on App Store (click "Release" in App Store Connect)
- [ ] 8:30 AM: Verify app is live (search App Store)
- [ ] 9:00 AM: Post launch tweet (with App Store link)
- [ ] 9:15 AM: Pin launch tweet to profile
- [ ] 9:30 AM: Post to ProductHunt (if not auto-posted at 12:01 AM)
- [ ] 9:45 AM: Ask 5-10 friends to upvote ProductHunt (first hour critical!)
- [ ] 10:00 AM: Post to Reddit:
  - r/iOSapps (follow rules: no self-promotion without value)
  - r/SideProject (share your story)
  - r/productivity (if relevant)
  - r/Apple (read rules carefully, may be removed)
- [ ] 10:30 AM - 6:00 PM: Monitor and engage:
  - ProductHunt comments (respond within 1 hour)
  - Reddit comments (respond within 1 hour)
  - Twitter mentions (respond within 1 hour)
  - App Store reviews (respond within 24 hours)
- [ ] 4:00 PM: Send press kit to 10-20 press contacts
- [ ] 6:00 PM: Take screenshots of metrics (downloads, upvotes, reviews)
- [ ] 8:00 PM: CELEBRATE! You launched! 🎊🍾

### Friday - Post-Launch Day 1
- [ ] Check App Store crash reports (Xcode Organizer)
- [ ] Respond to ALL App Store reviews (positive and negative)
- [ ] Thank early supporters (Twitter reply, ProductHunt comment)
- [ ] Monitor metrics:
  - App Store Connect: Downloads, purchases, crashes
  - ProductHunt: Upvotes, comments
  - Twitter: Likes, retweets, mentions
- [ ] Post "Thank you" tweet with Day 1 stats
- [ ] Start tracking metrics in spreadsheet (daily log)
- [ ] Reflect on launch, document lessons learned

**Week 8 Deliverables:**
- [ ] App live on App Store ✅
- [ ] Launch marketing executed ✅
- [ ] ProductHunt post live ✅
- [ ] Social media announcements made ✅
- [ ] Support channels ready ✅
- [ ] Metrics tracking started ✅

---

## Post-Launch Checklist (Week 9+)

### Daily (First Week)
- [ ] Check crash reports (Xcode Organizer)
- [ ] Respond to App Store reviews (all, within 24h)
- [ ] Respond to support emails (within 24h)
- [ ] Track metrics (downloads, revenue, ratings)

### Weekly (First Month)
- [ ] Analyze metrics (downloads, conversion, retention)
- [ ] Identify top user complaints (reviews, support)
- [ ] Identify top feature requests
- [ ] Plan v1.0.1 hotfix (if needed)
- [ ] Plan v1.1 features (based on feedback)

### Month 1 Review
- [ ] Downloads vs goal (goal: 1,000+)
- [ ] Revenue vs goal (goal: $500-1,000)
- [ ] App Store rating (goal: 4.5+)
- [ ] Crash-free rate (goal: >99.5%)
- [ ] Retention (Day 7: 50%+, Day 30: 25%+)
- [ ] Decide: Continue developing or pivot?

---

**Good luck! Ship it! 🚀**
