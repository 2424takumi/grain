# Grain App v1.0 MVP - Development Plan

**Project:** Grain - Privacy-First Photo Diary  
**Version:** v1.0 MVP  
**Timeline:** 8 weeks (1-2 months)  
**Target Launch:** Week of [INSERT DATE]  
**Developer:** Solo Developer  
**Status:** Pre-Development (Greenfield Project)

---

## Executive Summary

**What We're Building:**
A privacy-first, local-only photo diary app for iOS. Users take one daily photo with optional notes to create a visual journal of their life. All data stays on device (with optional iCloud sync).

**What We're NOT Building (Yet):**
- App blocking features (v1.2+)
- Gamification/achievements (v1.1)
- Widgets (v1.1)
- Soft nudges/notifications (v1.2)
- Time delay features (v1.5+)

**Key Constraints:**
- iOS 17+ only (SwiftData requirement)
- One-person team
- $4.99 one-time purchase
- No backend/server
- 8-week timeline

---

## 1. MVP Scope Definition

### 1.1 MUST HAVE (P0) - Cannot Ship Without

#### P0-1: Photo Capture
**User Story:** As a user, I want to take a daily photo so that I can document my day.

**Acceptance Criteria:**
- [ ] Tap camera button to open camera
- [ ] Camera uses device camera (front or back)
- [ ] Can switch between front/back camera
- [ ] Can see preview before saving
- [ ] Photo saves to local storage immediately
- [ ] Camera permission handling (request, denied state)
- [ ] Works on iPhone (all supported models)

**Technical Complexity:** 12 hours
- Camera integration: 4 hours
- Permission handling: 2 hours
- Photo storage: 4 hours
- Testing on devices: 2 hours

**Dependencies:** None (can start immediately)

**Technical Notes:**
- Use UIImagePickerController or AVFoundation (custom camera)
- Save as HEIC format (smaller file size)
- Implement PhotoCaptureService
- Handle iOS photo permissions (Info.plist)

---

#### P0-2: Entry Creation with Notes
**User Story:** As a user, I want to add text notes to my photo so that I can remember context about the day.

**Acceptance Criteria:**
- [ ] After taking photo, can add optional text note
- [ ] Text note supports multi-line input
- [ ] Character limit: 1,000 characters (reasonable for daily notes)
- [ ] Can save entry without note (photo only)
- [ ] Timestamp automatically recorded (date + time)
- [ ] Cannot create multiple entries for same day (one photo per day rule)

**Technical Complexity:** 8 hours
- UI design/implementation: 4 hours
- Validation logic: 2 hours
- Integration with data model: 2 hours

**Dependencies:** P0-1 (Photo Capture)

**Technical Notes:**
- Use TextEditor in SwiftUI
- Validate one-entry-per-day in repository layer
- Show friendly error if user tries to create duplicate entry

---

#### P0-3: Data Model & Persistence
**User Story:** As a user, I want my photos and notes to be saved permanently so that I don't lose my memories.

**Acceptance Criteria:**
- [ ] All entries persist after app restart
- [ ] Data stored locally on device
- [ ] Photos stored efficiently (HEIC format)
- [ ] No data loss on app updates
- [ ] Support for 1,000+ entries without performance degradation
- [ ] Data migrations handled gracefully

**Technical Complexity:** 16 hours
- SwiftData model design: 4 hours
- Repository pattern implementation: 4 hours
- File storage structure: 4 hours
- Migration strategy: 2 hours
- Testing/validation: 2 hours

**Dependencies:** None (foundation for everything)

**Technical Notes:**
- SwiftData model: `DiaryEntry` with id, date, photoFileName, noteText, createdAt
- Photos stored in Documents directory: `Photos/YYYY/MM/entry_id.heic`
- Repository pattern for clean architecture
- SwiftData automatic migrations (avoid complex schemas in v1.0)

---

#### P0-4: Timeline/Gallery View
**User Story:** As a user, I want to see all my past entries in chronological order so that I can browse my photo diary.

**Acceptance Criteria:**
- [ ] Shows all entries in reverse chronological order (newest first)
- [ ] Each entry shows: photo thumbnail, date, note preview (first 2 lines)
- [ ] Smooth scrolling (60fps)
- [ ] Pull-to-refresh updates view
- [ ] Empty state for new users ("Take your first photo!")
- [ ] Loads quickly even with 100+ entries

**Technical Complexity:** 12 hours
- SwiftUI List/Grid design: 4 hours
- Image loading/caching: 4 hours
- Performance optimization: 2 hours
- Empty state design: 2 hours

**Dependencies:** P0-3 (Data Model)

**Technical Notes:**
- Use LazyVGrid or List with @Query from SwiftData
- AsyncImage with caching for thumbnails
- Pagination if needed (load 50 at a time)
- Consider LazyVStack for performance

---

#### P0-5: Entry Detail View
**User Story:** As a user, I want to view a single entry in full detail so that I can see the full photo and read my complete notes.

**Acceptance Criteria:**
- [ ] Tap entry in timeline to view full detail
- [ ] Full-size photo displayed (pinch to zoom)
- [ ] Full text note displayed
- [ ] Date/time displayed prominently
- [ ] Back button to return to timeline
- [ ] Smooth navigation animations

**Technical Complexity:** 8 hours
- Detail view UI: 4 hours
- Image zoom functionality: 2 hours
- Navigation setup: 2 hours

**Dependencies:** P0-4 (Timeline View)

**Technical Notes:**
- Use NavigationStack in SwiftUI
- Implement custom zoom with .gesture (MagnificationGesture)
- Load full-resolution photo (not thumbnail)

---

#### P0-6: Edit Entry
**User Story:** As a user, I want to edit the text note on an existing entry so that I can correct mistakes or add more detail.

**Acceptance Criteria:**
- [ ] Tap "Edit" button in entry detail view
- [ ] Can modify text note
- [ ] Can save changes
- [ ] Can cancel without saving
- [ ] Updated timestamp shown ("Edited on...")
- [ ] Cannot change photo (only note is editable)
- [ ] Cannot change date (preserve original date)

**Technical Complexity:** 6 hours
- Edit UI: 3 hours
- Update logic: 2 hours
- Validation: 1 hour

**Dependencies:** P0-5 (Entry Detail View)

**Technical Notes:**
- Sheet or NavigationLink to edit screen
- Add `updatedAt` field to model
- Validate same constraints (character limit)

---

#### P0-7: Delete Entry
**User Story:** As a user, I want to delete an entry so that I can remove unwanted photos or mistakes.

**Acceptance Criteria:**
- [ ] Swipe-to-delete in timeline view
- [ ] Delete button in entry detail view
- [ ] Confirmation alert ("Are you sure?")
- [ ] Both photo and note deleted permanently
- [ ] Photo file removed from storage (free up space)
- [ ] No orphaned files

**Technical Complexity:** 6 hours
- Delete UI (swipe, button): 2 hours
- Confirmation alert: 1 hour
- Delete logic (data + file): 2 hours
- Testing: 1 hour

**Dependencies:** P0-4, P0-5 (Timeline & Detail Views)

**Technical Notes:**
- Use .swipeActions in SwiftUI List
- Alert with destructive action
- Delete photo file from Documents directory
- Repository method: deleteEntry(id) handles both DB and file

---

#### P0-8: Settings Screen
**User Story:** As a user, I want to configure app settings so that I can customize my experience.

**Acceptance Criteria:**
- [ ] Access settings from timeline view (gear icon)
- [ ] Settings include:
  - Default camera (front/back)
  - Photo quality (high/medium)
  - iCloud sync (on/off) - toggle only, implementation optional for v1.0
  - App version number
  - Privacy policy link
  - Contact support link
- [ ] Settings persist across app restarts
- [ ] Changes take effect immediately

**Technical Complexity:** 8 hours
- Settings UI: 4 hours
- UserDefaults integration: 2 hours
- Settings model: 2 hours

**Dependencies:** None (standalone feature)

**Technical Notes:**
- Use Form in SwiftUI
- Store in UserDefaults (simple key-value pairs)
- SettingsManager class to centralize access
- Privacy policy: static webpage or in-app text

---

#### P0-9: Onboarding Flow
**User Story:** As a new user, I want to understand what the app does and set it up so that I can start using it quickly.

**Acceptance Criteria:**
- [ ] Shown only on first launch
- [ ] 3 screens max:
  1. Welcome + value proposition
  2. How it works (take daily photo)
  3. Permission request (camera, optional notifications)
- [ ] Skip button on each screen
- [ ] "Get Started" button on final screen
- [ ] Never shown again after completion
- [ ] Clean, simple design matching app aesthetic

**Technical Complexity:** 10 hours
- UI design (3 screens): 6 hours
- Flow logic (first launch detection): 2 hours
- Testing: 2 hours

**Dependencies:** None (can be built in parallel)

**Technical Notes:**
- Use TabView with PageTabViewStyle for swipeable screens
- UserDefaults flag: hasCompletedOnboarding
- Request camera permission during onboarding (not on first camera use)

---

#### P0-10: App Icon & Branding
**User Story:** As a user, I want the app to have a professional icon and design so that it feels trustworthy.

**Acceptance Criteria:**
- [ ] App icon designed (1024x1024 source)
- [ ] All icon sizes generated (@1x, @2x, @3x)
- [ ] App name: "Grain" (or final chosen name)
- [ ] Color scheme defined (primary, secondary, accent)
- [ ] Typography defined (SF Pro, weights)
- [ ] Consistent visual style throughout app

**Technical Complexity:** 12 hours
- Icon design: 6 hours (DIY) or $50-100 (hire)
- Color scheme: 2 hours
- Apply branding throughout app: 4 hours

**Dependencies:** None (but impacts all UI work)

**Technical Notes:**
- Use SF Symbols for in-app icons
- Color assets in Xcode (semantic colors for dark mode)
- Consider: Warm, natural palette (aligns with "Grain" name)

---

#### P0-11: Dark Mode Support
**User Story:** As a user, I want the app to support dark mode so that I can use it comfortably at night.

**Acceptance Criteria:**
- [ ] All screens support light and dark mode
- [ ] Colors adapt automatically based on system setting
- [ ] Text remains readable in both modes
- [ ] Photos display correctly in both modes
- [ ] No manual toggle (follows system setting)

**Technical Complexity:** 6 hours
- Define semantic colors: 2 hours
- Test all screens: 3 hours
- Fix issues: 1 hour

**Dependencies:** P0-10 (Branding - need color scheme first)

**Technical Notes:**
- Use Color.primary, Color.secondary, custom semantic colors
- Test on device in both modes
- Avoid hardcoded colors

---

### 1.2 SHOULD HAVE (P1) - Important But Can Defer

#### P1-1: Export Functionality
**User Story:** As a user, I want to export my photos and notes so that I can back them up or share them.

**Acceptance Criteria:**
- [ ] Export all entries to PDF (with photos + text)
- [ ] Export all photos to Photos app
- [ ] Export notes to text file
- [ ] Share via iOS share sheet
- [ ] Export includes metadata (dates)

**Technical Complexity:** 16 hours
**Deferred to:** v1.0.1 if time permits, otherwise v1.1

---

#### P1-2: Search Functionality
**User Story:** As a user, I want to search my entries by text so that I can find specific memories.

**Acceptance Criteria:**
- [ ] Search bar in timeline view
- [ ] Searches note text
- [ ] Real-time results
- [ ] Clear search button

**Technical Complexity:** 8 hours
**Deferred to:** v1.1

---

#### P1-3: Calendar View
**User Story:** As a user, I want to see my entries in a calendar view so that I can see which days I've documented.

**Acceptance Criteria:**
- [ ] Monthly calendar grid
- [ ] Dots/markers on days with entries
- [ ] Tap day to view entry
- [ ] Navigate months

**Technical Complexity:** 20 hours
**Deferred to:** v1.1

---

#### P1-4: Streak Counter
**User Story:** As a user, I want to see my current streak so that I stay motivated to take daily photos.

**Acceptance Criteria:**
- [ ] Display current streak on timeline
- [ ] Calculate consecutive days
- [ ] Longest streak shown
- [ ] Visual indicator

**Technical Complexity:** 8 hours
**Deferred to:** v1.1 (part of gamification)

---

#### P1-5: iCloud Sync
**User Story:** As a user, I want my entries to sync across my devices so that I can access them anywhere.

**Acceptance Criteria:**
- [ ] Automatic sync when enabled
- [ ] Photos sync via iCloud
- [ ] SwiftData syncs via CloudKit
- [ ] Conflict resolution
- [ ] Works offline

**Technical Complexity:** 24 hours (complex to get right)
**Deferred to:** v1.0.1 or v1.1 (high priority but risky for v1.0)

---

### 1.3 WON'T HAVE - Explicitly Excluded from v1.0

- App blocking features (deferred to v1.2+)
- Gamification/achievements (deferred to v1.1)
- Widgets (deferred to v1.1)
- Notifications/reminders (deferred to v1.2)
- Time delay features (deferred to v1.5+)
- Social features/sharing (not on roadmap)
- Multiple photos per day (one photo per day is core concept)
- Video support (photos only)
- Filters/editing (use built-in camera features)
- Tags/categories (keep it simple)
- Face recognition (privacy concern)

---

## 2. Development Phases Breakdown

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Project infrastructure set up
- Core data model implemented
- Basic UI scaffolding
- Photo capture working end-to-end

**Week 1 Tasks:**

**Monday (8 hours):**
- [4h] Create Xcode project, configure settings
- [2h] Set up Git repository, .gitignore
- [2h] Project structure (folders, architecture)

**Tuesday (8 hours):**
- [4h] SwiftData model design (DiaryEntry)
- [2h] Repository pattern skeleton
- [2h] File storage structure setup

**Wednesday (8 hours):**
- [6h] PhotoCaptureService implementation
- [2h] Camera permissions (Info.plist, handling)

**Thursday (8 hours):**
- [4h] Photo storage service (save HEIC to disk)
- [4h] Integration: capture + save + persist

**Friday (6 hours):**
- [4h] Testing on physical device
- [2h] Bug fixes, polish

**Weekend (Optional 4 hours):**
- Catch-up if behind schedule
- Code review, refactoring

**Week 1 Deliverables:**
- ✅ Xcode project configured
- ✅ SwiftData schema implemented and tested
- ✅ Can take a photo with device camera
- ✅ Photo saves to local storage
- ✅ Basic repository pattern working

---

**Week 2 Tasks:**

**Monday (8 hours):**
- [6h] Entry creation flow (UI + ViewModel)
- [2h] Text note input component

**Tuesday (8 hours):**
- [4h] One-entry-per-day validation
- [4h] Entry creation logic (photo + note + timestamp)

**Wednesday (8 hours):**
- [6h] Basic timeline view (List with entries)
- [2h] Empty state UI

**Thursday (8 hours):**
- [4h] Timeline cell design (thumbnail + date + note preview)
- [4h] Load entries from SwiftData (@Query)

**Friday (6 hours):**
- [4h] Integration testing
- [2h] Bug fixes

**Weekend (Optional 4 hours):**
- Catch-up / polish

**Week 2 Deliverables:**
- ✅ Complete entry creation flow
- ✅ Timeline view displays all entries
- ✅ Can create multiple entries (different days)
- ✅ Data persists correctly across app restarts

---

### Phase 2: Core Features (Week 3-4)

**Goals:**
- Entry detail view
- Edit/delete functionality
- Navigation polished
- All P0 CRUD operations complete

**Week 3 Tasks:**

**Monday (8 hours):**
- [6h] Entry detail view UI (full photo, full note, metadata)
- [2h] Navigation from timeline to detail

**Tuesday (8 hours):**
- [4h] Pinch-to-zoom on detail photo
- [4h] Detail view polish (layout, typography)

**Wednesday (8 hours):**
- [6h] Edit entry feature (UI + logic)
- [2h] Edit validation

**Thursday (8 hours):**
- [4h] Delete entry feature (swipe-to-delete)
- [2h] Confirmation alert
- [2h] Delete file from disk

**Friday (6 hours):**
- [4h] Testing all CRUD operations
- [2h] Bug fixes

**Weekend (Optional 4 hours):**
- Catch-up / polish

**Week 3 Deliverables:**
- ✅ Can view entry in detail
- ✅ Can edit entry text
- ✅ Can delete entry
- ✅ All CRUD operations working smoothly

---

**Week 4 Tasks:**

**Monday (8 hours):**
- [6h] Settings screen UI (Form layout)
- [2h] SettingsManager + UserDefaults

**Tuesday (8 hours):**
- [4h] Settings: default camera, photo quality
- [4h] Settings: app version, links (privacy, support)

**Wednesday (8 hours):**
- [6h] App icon design (DIY or commission)
- [2h] Color scheme finalization

**Thursday (8 hours):**
- [4h] Apply branding throughout app
- [4h] Dark mode color definitions

**Friday (6 hours):**
- [4h] Dark mode testing/fixes
- [2h] Visual polish

**Weekend (Optional 4 hours):**
- Catch-up / polish

**Week 4 Deliverables:**
- ✅ Settings screen functional
- ✅ App icon and branding complete
- ✅ Dark mode fully supported
- ✅ App has cohesive visual identity

---

### Phase 3: Polish & UX (Week 5-6)

**Goals:**
- Onboarding flow
- UX refinements
- Performance optimization
- Feature-complete for beta

**Week 5 Tasks:**

**Monday (8 hours):**
- [6h] Onboarding screen designs (3 screens)
- [2h] Onboarding flow logic

**Tuesday (8 hours):**
- [4h] Onboarding integration (first launch)
- [4h] Permission requests during onboarding

**Wednesday (8 hours):**
- [6h] Performance audit (image loading, list scrolling)
- [2h] Optimize image caching

**Thursday (8 hours):**
- [4h] Memory profiling (Instruments)
- [4h] Fix memory leaks, optimize

**Friday (6 hours):**
- [6h] UX polish pass (animations, transitions, haptics)

**Weekend (Optional 4 hours):**
- Catch-up / polish

**Week 5 Deliverables:**
- ✅ Onboarding flow complete
- ✅ App performs smoothly (60fps, low memory)
- ✅ UX feels polished and professional

---

**Week 6 Tasks:**

**Monday (8 hours):**
- [4h] Accessibility audit (VoiceOver, Dynamic Type)
- [4h] Accessibility improvements

**Tuesday (8 hours):**
- [4h] Edge case testing (no photos, 1000+ entries, etc.)
- [4h] Bug fixes

**Wednesday (8 hours):**
- [8h] Comprehensive manual testing checklist

**Thursday (8 hours):**
- [8h] Bug fixes from testing

**Friday (6 hours):**
- [4h] Final polish
- [2h] Prepare TestFlight build

**Weekend:**
- Submit to TestFlight
- Recruit beta testers

**Week 6 Deliverables:**
- ✅ Feature-complete app
- ✅ All P0 features working
- ✅ Ready for beta testing
- ✅ TestFlight build submitted

---

### Phase 4: Testing & Launch Prep (Week 7-8)

**Goals:**
- Beta testing via TestFlight
- Bug fixes based on feedback
- App Store preparation
- Launch execution

**Week 7 Tasks:**

**Monday (4 hours):**
- [2h] Monitor TestFlight crashes
- [2h] Review beta tester feedback

**Tuesday (8 hours):**
- [8h] Fix P0 bugs from beta testing

**Wednesday (8 hours):**
- [8h] Fix P1 bugs from beta testing

**Thursday (8 hours):**
- [4h] App Store screenshots (5-6 screenshots)
- [4h] App Store preview video (optional but recommended)

**Friday (6 hours):**
- [6h] App Store description, keywords, metadata

**Weekend:**
- Marketing preparation (ProductHunt, Twitter, Reddit)

**Week 7 Deliverables:**
- ✅ All critical bugs fixed
- ✅ Beta testers happy with stability
- ✅ App Store assets complete

---

**Week 8 Tasks:**

**Monday (8 hours):**
- [4h] Final testing on multiple devices/iOS versions
- [4h] Final bug fixes

**Tuesday (6 hours):**
- [4h] Privacy policy finalization
- [2h] Support documentation (FAQ, email templates)

**Wednesday (4 hours):**
- [4h] App Store submission
- Wait for review (1-2 days typically)

**Thursday (4 hours):**
- [2h] Respond to App Review if needed
- [2h] ProductHunt post preparation

**Friday (4 hours):**
- [2h] Monitor approval status
- [2h] Plan launch day activities

**Weekend (Launch Day):**
- Release app to App Store
- ProductHunt launch
- Social media announcements
- Monitor reviews/crashes

**Week 8 Deliverables:**
- ✅ App live on App Store
- ✅ Launch marketing executed
- ✅ Support channels ready
- ✅ Monitoring in place

---

## 3. Technical Implementation Details

### 3.1 Data Layer

#### SwiftData Models

```swift
import SwiftData
import Foundation

@Model
final class DiaryEntry {
    @Attribute(.unique) var id: UUID
    var date: Date // Day of the entry (normalized to midnight)
    var photoFileName: String // e.g., "123e4567-e89b.heic"
    var noteText: String? // Optional text note
    var createdAt: Date
    var updatedAt: Date?
    
    init(id: UUID = UUID(), 
         date: Date, 
         photoFileName: String, 
         noteText: String? = nil) {
        self.id = id
        self.date = date.normalized() // Normalize to midnight
        self.photoFileName = photoFileName
        self.noteText = noteText
        self.createdAt = Date()
        self.updatedAt = nil
    }
}

extension Date {
    func normalized() -> Date {
        Calendar.current.startOfDay(for: self)
    }
}
```

**Why this structure:**
- `UUID` for unique identification
- `date` normalized to midnight (ensures one-per-day logic)
- `photoFileName` separates data from binary (photos not in DB)
- Optional `noteText` (photo-only entries allowed)
- `createdAt` vs `updatedAt` for edit tracking

---

#### Repository Pattern

```swift
protocol DiaryRepository {
    func createEntry(photo: UIImage, note: String?, date: Date) async throws -> DiaryEntry
    func getAllEntries() async throws -> [DiaryEntry]
    func getEntry(id: UUID) async throws -> DiaryEntry?
    func getEntry(for date: Date) async throws -> DiaryEntry?
    func updateEntry(id: UUID, noteText: String) async throws
    func deleteEntry(id: UUID) async throws
}

final class SwiftDataDiaryRepository: DiaryRepository {
    private let modelContext: ModelContext
    private let photoStorage: PhotoStorageService
    
    init(modelContext: ModelContext, photoStorage: PhotoStorageService) {
        self.modelContext = modelContext
        self.photoStorage = photoStorage
    }
    
    func createEntry(photo: UIImage, note: String?, date: Date) async throws -> DiaryEntry {
        // 1. Check if entry exists for this date
        if let existing = try await getEntry(for: date) {
            throw DiaryError.entryAlreadyExists(date: date)
        }
        
        // 2. Save photo to disk
        let photoFileName = try await photoStorage.savePhoto(photo, date: date)
        
        // 3. Create entry
        let entry = DiaryEntry(date: date, photoFileName: photoFileName, noteText: note)
        modelContext.insert(entry)
        try modelContext.save()
        
        return entry
    }
    
    func deleteEntry(id: UUID) async throws {
        guard let entry = try await getEntry(id: id) else {
            throw DiaryError.entryNotFound
        }
        
        // 1. Delete photo from disk
        try await photoStorage.deletePhoto(fileName: entry.photoFileName)
        
        // 2. Delete from database
        modelContext.delete(entry)
        try modelContext.save()
    }
    
    // ... other methods
}
```

**Benefits:**
- Clean separation of concerns
- Easy to test (mock repository)
- SwiftData details hidden from UI layer
- Atomic operations (photo + DB together)

---

#### File Storage Structure

```
Documents/
  Photos/
    2024/
      01/
        123e4567-e89b.heic
        987fcdeb-51a2.heic
      02/
        ...
    2025/
      ...
```

**Why this structure:**
- Organized by year/month (easier to browse in Files app)
- UUID filenames prevent conflicts
- HEIC format (smaller than JPEG, native to iOS)
- Easy to calculate storage used
- Easy to implement export features later

---

#### Data Migration Strategy

**v1.0 Strategy: Avoid Migrations**
- Keep model simple
- No complex relationships
- Avoid schema changes in v1.0.x

**Future Migration Plan:**
- SwiftData handles lightweight migrations automatically
- For complex migrations: use `VersionedSchema`
- Test migrations thoroughly in beta

---

### 3.2 Business Logic

#### Use Cases

**CreateEntryUseCase:**
```swift
struct CreateEntryUseCase {
    private let repository: DiaryRepository
    
    func execute(photo: UIImage, note: String?, date: Date = Date()) async throws -> DiaryEntry {
        // Validate
        if let note = note {
            try validateNote(note)
        }
        
        // Create
        return try await repository.createEntry(photo: photo, note: note, date: date)
    }
    
    private func validateNote(_ note: String) throws {
        guard note.count <= 1000 else {
            throw ValidationError.noteTooLong
        }
    }
}
```

**GetTodayEntryUseCase:**
```swift
struct GetTodayEntryUseCase {
    private let repository: DiaryRepository
    
    func execute() async throws -> DiaryEntry? {
        try await repository.getEntry(for: Date())
    }
    
    func hasTodayEntry() async -> Bool {
        (try? await execute()) != nil
    }
}
```

**Why Use Cases:**
- Single responsibility (one use case = one business operation)
- Easy to test business logic
- Reusable across ViewModels
- Clear separation from UI

---

#### Validation Rules

1. **One Entry Per Day:**
   - Enforced in repository layer
   - Date normalized to midnight
   - Throw error if duplicate

2. **Text Note:**
   - Max 1,000 characters
   - Optional (can be nil)
   - Trimmed of whitespace

3. **Photo:**
   - Required (cannot create entry without photo)
   - Must be valid UIImage
   - Compressed to reasonable size (< 5MB after HEIC)

4. **Date:**
   - Cannot be future date
   - Can be past date (for backfilling)
   - Defaults to today

---

### 3.3 Presentation Layer

#### SwiftUI Views Architecture

```
App
├── GrainApp.swift (entry point, SwiftData setup)
├── ContentView.swift (root navigation)
│
├── Timeline/
│   ├── TimelineView.swift (main list)
│   ├── TimelineViewModel.swift
│   ├── EntryRowView.swift (list cell)
│   └── EmptyStateView.swift
│
├── EntryDetail/
│   ├── EntryDetailView.swift
│   ├── EntryDetailViewModel.swift
│   └── ZoomablePhotoView.swift
│
├── CreateEntry/
│   ├── CameraView.swift
│   ├── CreateEntryView.swift (photo + note input)
│   ├── CreateEntryViewModel.swift
│   └── PhotoPreviewView.swift
│
├── EditEntry/
│   ├── EditEntryView.swift
│   └── EditEntryViewModel.swift
│
├── Settings/
│   ├── SettingsView.swift
│   └── SettingsViewModel.swift
│
├── Onboarding/
│   ├── OnboardingContainerView.swift
│   ├── OnboardingPageView.swift
│   └── OnboardingViewModel.swift
│
└── Shared/
    ├── Components/ (buttons, text fields, etc.)
    └── Extensions/
```

---

#### ViewModels Structure

**TimelineViewModel:**
```swift
@Observable
final class TimelineViewModel {
    private let repository: DiaryRepository
    private let getTodayEntryUseCase: GetTodayEntryUseCase
    
    var entries: [DiaryEntry] = []
    var hasTodayEntry: Bool = false
    var isLoading: Bool = false
    var error: Error?
    
    init(repository: DiaryRepository) {
        self.repository = repository
        self.getTodayEntryUseCase = GetTodayEntryUseCase(repository: repository)
    }
    
    @MainActor
    func loadEntries() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            entries = try await repository.getAllEntries()
            hasTodayEntry = await getTodayEntryUseCase.hasTodayEntry()
        } catch {
            self.error = error
        }
    }
    
    func deleteEntry(id: UUID) async throws {
        try await repository.deleteEntry(id: id)
        await loadEntries() // Refresh
    }
}
```

**Why @Observable:**
- SwiftUI native (iOS 17+)
- Cleaner than ObservableObject
- Automatic view updates

---

#### Navigation Flow

```
Root: NavigationStack
  └─ TimelineView
       ├─ .sheet → CreateEntryView (modal, full screen)
       ├─ .navigationDestination → EntryDetailView
       │    └─ .sheet → EditEntryView
       └─ .navigationDestination → SettingsView

Onboarding: .fullScreenCover (if first launch)
```

**Navigation Design Principles:**
- Single NavigationStack at root
- Modal sheets for creation/editing (clear "save" or "cancel")
- Push navigation for viewing (back button)
- Onboarding as full screen cover (can't dismiss)

---

#### State Management

**App-Level State:**
- SwiftData ModelContainer (injected via environment)
- SettingsManager (singleton, UserDefaults)
- PhotoStorageService (singleton)

**View-Level State:**
- ViewModels own their state
- Use @State for local UI state (text field values, alerts)
- Use @Environment for injected dependencies

**No Global State:**
- Avoid shared mutable state
- Pass dependencies explicitly
- Use dependency injection

---

### 3.4 Services

#### PhotoCaptureService

```swift
import UIKit
import AVFoundation

final class PhotoCaptureService {
    enum CameraPosition {
        case front, back
    }
    
    func requestPermission() async -> Bool {
        await AVCaptureDevice.requestAccess(for: .video)
    }
    
    func capturePhoto(from camera: CameraPosition) async throws -> UIImage {
        // UIImagePickerController or custom AVFoundation implementation
        // Return UIImage
    }
}
```

**Implementation Options:**
1. **UIImagePickerController** (simpler, less control)
2. **AVFoundation** (full control, custom UI)

**Recommendation for v1.0:** UIImagePickerController (faster to implement)  
**Future:** Custom camera with AVFoundation (v1.1+)

---

#### PhotoStorageService

```swift
import UIKit

final class PhotoStorageService {
    private let fileManager = FileManager.default
    private let photosDirectory: URL
    
    init() {
        let documents = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        photosDirectory = documents.appendingPathComponent("Photos")
        try? fileManager.createDirectory(at: photosDirectory, withIntermediateDirectories: true)
    }
    
    func savePhoto(_ image: UIImage, date: Date) throws -> String {
        let fileName = "\(UUID().uuidString).heic"
        let yearMonth = date.formatted(.dateTime.year().month())
        let directory = photosDirectory.appendingPathComponent(yearMonth)
        try fileManager.createDirectory(at: directory, withIntermediateDirectories: true)
        
        let fileURL = directory.appendingPathComponent(fileName)
        
        guard let heicData = image.heicData() else {
            throw PhotoError.conversionFailed
        }
        
        try heicData.write(to: fileURL)
        return fileName
    }
    
    func loadPhoto(fileName: String, date: Date) throws -> UIImage {
        let yearMonth = date.formatted(.dateTime.year().month())
        let fileURL = photosDirectory
            .appendingPathComponent(yearMonth)
            .appendingPathComponent(fileName)
        
        guard let image = UIImage(contentsOfFile: fileURL.path) else {
            throw PhotoError.loadFailed
        }
        
        return image
    }
    
    func deletePhoto(fileName: String) throws {
        // Search all year/month folders for this file
        // Delete when found
    }
}

extension UIImage {
    func heicData(compressionQuality: CGFloat = 0.8) -> Data? {
        // Convert to HEIC using ImageIO
    }
}
```

---

#### PermissionsManager

```swift
import Photos
import AVFoundation

final class PermissionsManager {
    enum Permission {
        case camera
        case photoLibrary
    }
    
    func requestPermission(_ permission: Permission) async -> Bool {
        switch permission {
        case .camera:
            return await AVCaptureDevice.requestAccess(for: .video)
        case .photoLibrary:
            return await PHPhotoLibrary.requestAuthorization(for: .addOnly) == .authorized
        }
    }
    
    func checkPermission(_ permission: Permission) -> Bool {
        switch permission {
        case .camera:
            return AVCaptureDevice.authorizationStatus(for: .video) == .authorized
        case .photoLibrary:
            return PHPhotoLibrary.authorizationStatus(for: .addOnly) == .authorized
        }
    }
}
```

---

## 4. Development Workflow

### 4.1 Sprint Structure

**Sprint Length:** 1 week (Monday-Friday)

**Why 1 week:**
- Faster feedback loops
- Easier to estimate small chunks
- More flexibility to adjust
- Solo developer = less coordination overhead

**Sprint Cadence:**

**Monday 9 AM: Sprint Planning (30 min)**
- Review last week's progress
- Select tasks for this week
- Break down tasks into daily goals
- Identify blockers

**Daily: Standup (Solo, 5 min)**
- What did I accomplish yesterday?
- What will I do today?
- Any blockers?
- Quick note in journal

**Friday 4 PM: Sprint Review (30 min)**
- Demo what was built
- Update progress tracker
- Record what was learned

**Friday 4:30 PM: Retrospective (30 min)**
- What went well?
- What could improve?
- Action items for next week

---

### 4.2 Version Control

#### Git Branching Strategy

**Simple GitHub Flow (solo developer):**

```
main (always deployable)
  ↑
feature/onboarding-flow
feature/photo-capture
feature/timeline-view
fix/camera-permission-bug
```

**Rules:**
- `main` branch is always stable (can TestFlight from main)
- Create feature branch for each feature
- Merge to main when feature complete and tested
- No direct commits to main (use PR even solo, for accountability)
- Delete feature branches after merge

**Branch Naming:**
- `feature/feature-name` (e.g., feature/photo-capture)
- `fix/bug-name` (e.g., fix/crash-on-delete)
- `chore/task-name` (e.g., chore/setup-swiftlint)

---

#### Commit Message Conventions

**Format:** `type: subject`

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring (no behavior change)
- `test:` Adding/updating tests
- `docs:` Documentation
- `chore:` Tooling, dependencies, config

**Examples:**
- `feat: add photo capture with camera permission handling`
- `fix: prevent duplicate entries on same day`
- `refactor: extract photo storage into separate service`
- `test: add unit tests for DiaryRepository`

**Why:**
- Clear history
- Easy to generate changelogs
- Easy to identify what changed

---

#### PR Review Process (Solo)

**Even when solo, use PRs for:**
- Self-review before merging
- Documentation of changes
- Testing checklist
- Pause to reflect on code quality

**PR Template:**
```markdown
## What changed?
[Brief description]

## Why?
[Rationale, context]

## Testing
- [ ] Tested on iPhone 15 Pro (iOS 17.5)
- [ ] Tested on iPhone SE (iOS 17.0)
- [ ] Dark mode tested
- [ ] No new warnings

## Screenshots
[If UI changes]

## Notes
[Any concerns, trade-offs, or follow-ups]
```

---

### 4.3 Testing Strategy

#### Unit Tests

**What to test:**
- Business logic (use cases, validation)
- Repository (mock SwiftData context)
- ViewModels (test state changes)
- Services (PhotoStorageService, etc.)

**What NOT to test:**
- SwiftUI views (difficult, low ROI)
- Third-party code
- Trivial getters/setters

**Target Coverage:** 60-70% (focus on critical paths)

**Test Structure:**
```swift
@testable import Grain
import XCTest

final class CreateEntryUseCaseTests: XCTestCase {
    var sut: CreateEntryUseCase!
    var mockRepository: MockDiaryRepository!
    
    override func setUp() {
        super.setUp()
        mockRepository = MockDiaryRepository()
        sut = CreateEntryUseCase(repository: mockRepository)
    }
    
    func testCreateEntry_WithValidData_CreatesEntry() async throws {
        // Given
        let photo = UIImage()
        let note = "Test note"
        
        // When
        let entry = try await sut.execute(photo: photo, note: note)
        
        // Then
        XCTAssertEqual(entry.noteText, note)
        XCTAssertTrue(mockRepository.createEntryCalled)
    }
    
    func testCreateEntry_WithTooLongNote_ThrowsError() async {
        // Given
        let photo = UIImage()
        let note = String(repeating: "x", count: 1001)
        
        // Then
        await XCTAssertThrowsError(try await sut.execute(photo: photo, note: note))
    }
}
```

---

#### UI Tests

**What to test (minimal for v1.0):**
- Critical user flows:
  1. Onboarding → Take first photo → See in timeline
  2. View entry → Edit note → See updated note
  3. Delete entry → Confirm → Entry gone

**UI Test Example:**
```swift
final class GrainUITests: XCTestCase {
    func testCompleteFirstEntryFlow() throws {
        let app = XCUIApplication()
        app.launch()
        
        // Skip onboarding
        app.buttons["Get Started"].tap()
        
        // Take photo
        app.buttons["Take Photo"].tap()
        app.buttons["Capture"].tap()
        app.buttons["Use Photo"].tap()
        
        // Add note
        let noteField = app.textViews["noteTextView"]
        noteField.tap()
        noteField.typeText("My first entry")
        app.buttons["Save"].tap()
        
        // Verify in timeline
        XCTAssertTrue(app.staticTexts["My first entry"].exists)
    }
}
```

**UI Test Limitations:**
- Slow to run
- Brittle (break with UI changes)
- Hard to maintain

**Strategy:** Write 3-5 critical flow tests, supplement with manual testing

---

#### Manual Testing Checklist

**Before each TestFlight build:**

**✓ Functional Testing**
- [ ] Take photo with front camera
- [ ] Take photo with back camera
- [ ] Add entry with note
- [ ] Add entry without note
- [ ] View all entries in timeline
- [ ] View entry detail
- [ ] Edit entry note
- [ ] Delete entry (swipe)
- [ ] Delete entry (detail button)
- [ ] Prevent duplicate entry same day
- [ ] Settings: change default camera
- [ ] Settings: toggle photo quality
- [ ] Onboarding shown on first launch
- [ ] Onboarding not shown on subsequent launches

**✓ UI/UX Testing**
- [ ] All screens tested in light mode
- [ ] All screens tested in dark mode
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone 15 Pro Max (large screen)
- [ ] VoiceOver navigation works
- [ ] Dynamic Type (large text) works
- [ ] Animations smooth (60fps)
- [ ] No visual glitches

**✓ Performance Testing**
- [ ] Timeline scrolls smoothly with 100+ entries
- [ ] Photo loads quickly in detail view
- [ ] App launches in < 2 seconds
- [ ] No memory leaks (Instruments)
- [ ] No crashes (run for 30 min)

**✓ Edge Cases**
- [ ] No entries (empty state)
- [ ] 1,000+ entries (stress test)
- [ ] Very long note (1,000 chars)
- [ ] Airplane mode (no network)
- [ ] Low storage warning
- [ ] Background/foreground transitions
- [ ] Force quit and reopen

**✓ Permissions**
- [ ] Camera permission: Allow
- [ ] Camera permission: Deny → Show error
- [ ] Photo library permission: Allow
- [ ] Photo library permission: Deny → Show error

---

#### TestFlight Beta Testing Plan

**Beta Timeline:** Week 6-7 (2 weeks)

**Tester Recruitment:**
- Friends/family: 10-15 testers
- Twitter/Reddit: 20-30 testers
- TestFlight limit: 10,000 (plenty for v1.0)

**Target:** 30-50 testers total

**Tester Profiles:**
- Mix of iPhone models (SE, 14, 15, 15 Pro)
- Mix of iOS versions (17.0, 17.5, 18.0 beta)
- Mix of user types (tech-savvy, non-tech)

**Feedback Collection:**
- TestFlight built-in feedback
- Google Form survey (structured questions)
- WhatsApp/Discord group (casual feedback)

**Survey Questions:**
1. How easy was onboarding? (1-5)
2. Did you encounter any bugs? (describe)
3. Was the app easy to use? (1-5)
4. What feature is missing?
5. Would you pay $4.99 for this? (Y/N)
6. Any other feedback?

**Success Criteria:**
- < 5% crash rate
- Average rating 4+ (out of 5)
- 70%+ would pay $4.99
- No P0 bugs reported

---

### 4.4 Code Quality

#### SwiftLint Rules

**Configuration:** `.swiftlint.yml`

```yaml
disabled_rules:
  - trailing_whitespace
  - line_length (too restrictive for SwiftUI)

opt_in_rules:
  - empty_count
  - empty_string
  - explicit_init
  - force_unwrapping (catch forced unwraps)

excluded:
  - Pods
  - .build
  - Derived Data

line_length:
  warning: 120
  error: 200

identifier_name:
  min_length: 2
  max_length: 50

function_body_length:
  warning: 50
  error: 100

type_body_length:
  warning: 300
  error: 500

file_length:
  warning: 500
  error: 1000

cyclomatic_complexity:
  warning: 10
  error: 20
```

**Run SwiftLint:**
- Add Build Phase in Xcode
- Runs automatically on build
- Fails build on errors

---

#### Code Review Checklist

**Before merging PR (self-review):**

**✓ Functionality**
- [ ] Feature works as expected
- [ ] No regressions (existing features still work)
- [ ] Edge cases handled
- [ ] Error handling in place

**✓ Code Quality**
- [ ] Follows MVVM architecture
- [ ] Single responsibility (functions/classes)
- [ ] No code duplication
- [ ] Meaningful variable names
- [ ] No magic numbers (use constants)
- [ ] SwiftLint passes

**✓ Testing**
- [ ] Unit tests for business logic
- [ ] Tested on device (not just simulator)
- [ ] No new warnings

**✓ Documentation**
- [ ] Complex logic has comments
- [ ] Public APIs documented
- [ ] README updated (if needed)

**✓ Performance**
- [ ] No obvious performance issues
- [ ] Images optimized
- [ ] No memory leaks

---

#### Documentation Standards

**Code Documentation:**

**When to document:**
- Complex algorithms
- Non-obvious business rules
- Public APIs (if building framework)
- Workarounds for bugs

**When NOT to document:**
- Obvious code (self-documenting)
- Trivial functions

**Example:**
```swift
/// Normalizes a date to midnight in the user's current timezone.
/// This ensures all dates are comparable for "one entry per day" validation.
///
/// - Parameter date: The date to normalize
/// - Returns: A new date set to midnight (00:00:00)
func normalize(_ date: Date) -> Date {
    Calendar.current.startOfDay(for: date)
}
```

**README Documentation:**

**Include:**
- Project overview
- How to run the project
- Architecture overview
- Key decisions (why SwiftData, why MVVM)
- How to contribute (if open-source)

---

## 5. Risk Management

### 5.1 Technical Risks

#### Risk 1: SwiftData Bugs (iOS 17 API Maturity)

**Probability:** 60%  
**Impact:** 8/10 (could require rewrite to Core Data)  
**Risk Score:** 4.8 (High)

**Description:**
SwiftData is relatively new (iOS 17+). May have bugs, performance issues, or missing features. Could impact data persistence reliability.

**Mitigation Strategy:**
- Research SwiftData issues on forums early (Week 1)
- Build data layer first (Week 1-2) to validate
- Keep data model simple (avoid complex relationships)
- Write comprehensive tests for data layer
- Have fallback plan ready

**Contingency Plan:**
If SwiftData is unusable:
- Fall back to Core Data (well-tested, mature)
- Cost: 1 week to rewrite data layer
- Still feasible within 8-week timeline
- Raises minimum iOS to 15+ (wider compatibility)

**Action Items:**
- [ ] Week 1: Build simple SwiftData prototype
- [ ] Week 1: Test with 1,000+ entries
- [ ] Week 2: Decision point: proceed or switch to Core Data

---

#### Risk 2: Photo Storage/Performance Issues

**Probability:** 40%  
**Impact:** 6/10 (poor UX, but fixable)  
**Risk Score:** 2.4 (Medium)

**Description:**
With hundreds of photos, app may use significant storage or have slow load times. HEIC compression may not be sufficient.

**Mitigation Strategy:**
- Use HEIC format (smaller than JPEG)
- Implement lazy loading (don't load all photos at once)
- Generate thumbnails for timeline (smaller files)
- Limit photo resolution (e.g., max 2048px width)
- Test with 500+ photos during development

**Contingency Plan:**
If performance issues arise:
- Implement thumbnail generation (Week 5)
- Add photo quality settings (Low/Medium/High)
- Paginate timeline (load 50 at a time)
- Cost: 4-8 hours

**Action Items:**
- [ ] Week 2: Implement HEIC compression
- [ ] Week 4: Test with 100 photos
- [ ] Week 5: Performance profiling with Instruments

---

#### Risk 3: Device Compatibility Issues

**Probability:** 30%  
**Impact:** 7/10 (blocks users from using app)  
**Risk Score:** 2.1 (Medium)

**Description:**
App may not work well on older devices (iPhone SE, iPhone 12) or older iOS versions (iOS 17.0 vs 17.5).

**Mitigation Strategy:**
- Test on multiple devices early (Week 3+)
- Use physical devices (not just simulator)
- Borrow/buy used iPhone SE for testing
- TestFlight with diverse device mix

**Contingency Plan:**
If critical bugs on specific devices:
- Prioritize fixes for most common devices
- Block incompatible devices in App Store (last resort)
- Delay launch 1 week if needed

**Action Items:**
- [ ] Week 3: Test on iPhone SE (small screen)
- [ ] Week 4: Test on iPhone 12 (older chip)
- [ ] Week 6: TestFlight with device diversity
- [ ] Week 7: Fix device-specific bugs

---

#### Risk 4: iOS Version Fragmentation

**Probability:** 20%  
**Impact:** 5/10 (limits addressable market)  
**Risk Score:** 1.0 (Low)

**Description:**
Requiring iOS 17+ limits to ~30-40% of iOS users (as of 2024). May reduce potential downloads.

**Mitigation Strategy:**
- Accept trade-off (iOS 17+ for SwiftData)
- Market to early adopters (likely to have latest iOS)
- Monitor iOS 17 adoption rates

**Contingency Plan:**
If iOS 17+ requirement is too limiting:
- v1.1: Backport to iOS 16 using Core Data
- Cost: 1-2 weeks
- Expands market by ~30%

**Action Items:**
- [ ] Pre-launch: Research iOS 17 adoption rates
- [ ] Post-launch: Monitor conversion rates
- [ ] v1.1 planning: Decide on iOS 16 support

---

### 5.2 Schedule Risks

#### Risk 5: Feature Creep

**Probability:** 70%  
**Impact:** 9/10 (delays launch significantly)  
**Risk Score:** 6.3 (High)

**Description:**
Temptation to add "just one more feature" delays launch. Common in solo projects without external accountability.

**Mitigation Strategy:**
- Strict P0/P1/Won't Have list (this document)
- Weekly review: "Is this P0?"
- Lock scope after Week 2
- Use "Future Features" list for ideas
- Accountability partner (friend, online community)

**Contingency Plan:**
If scope creep detected:
- Immediate scope review
- Move new features to v1.1
- Extend timeline only if P0 feature

**Action Items:**
- [ ] Week 2: Lock scope (no new P0 features)
- [ ] Weekly: Review if on track for 8-week timeline
- [ ] Share progress publicly (Twitter) for accountability

---

#### Risk 6: Underestimated Complexity

**Probability:** 60%  
**Impact:** 7/10 (delays launch)  
**Risk Score:** 4.2 (High)

**Description:**
Task estimates may be too optimistic. Complex tasks take 2x longer than expected.

**Mitigation Strategy:**
- Add 30% buffer to all estimates
- Track actual time vs estimated (learn for future)
- Identify blockers early
- Ask for help (forums, Stack Overflow)

**Contingency Plan:**
If falling behind:
- Week 4 checkpoint: Assess if 8 weeks feasible
- Option 1: Reduce scope (drop P1 features)
- Option 2: Extend timeline to 10 weeks
- Option 3: Work weekends (unsustainable, avoid)

**Action Items:**
- [ ] Weekly: Track actual hours vs estimated
- [ ] Week 4: Mid-project review (on track?)
- [ ] Week 6: Final scope lock (no more changes)

---

#### Risk 7: Personal Availability (Solo Developer)

**Probability:** 40%  
**Impact:** 8/10 (could halt project)  
**Risk Score:** 3.2 (Medium-High)

**Description:**
Illness, burnout, other commitments may reduce available hours. No backup developer.

**Mitigation Strategy:**
- Realistic daily hours (6h, not 8h, to avoid burnout)
- Build buffer into schedule (weekends optional, not required)
- Take breaks (1 day off per week)
- Maintain health (sleep, exercise)

**Contingency Plan:**
If unable to work for 1+ week:
- Extend timeline proportionally
- Communicate to beta testers (if in beta phase)
- Prioritize P0 features only

**Action Items:**
- [ ] Plan sustainable work schedule (6h/day max)
- [ ] Schedule 1 day off per week
- [ ] Monitor burnout signs (decreased productivity, frustration)

---

#### Risk 8: External Dependencies

**Probability:** 30%  
**Impact:** 6/10 (delays specific features)  
**Risk Score:** 1.8 (Low-Medium)

**Description:**
Dependence on Apple (App Review, TestFlight), third-party services (if added), or tools (Xcode betas).

**Mitigation Strategy:**
- Use stable Xcode version (not beta)
- No third-party dependencies in v1.0 (keep it simple)
- Submit to App Review early (buffer for rejection)
- Have App Store assets ready early

**Contingency Plan:**
If App Review rejects:
- Common reasons: bugs, privacy issues, guideline violations
- Fix and resubmit (1-3 days turnaround)
- Built-in buffer in Week 8

**Action Items:**
- [ ] Week 7: Complete App Store prep (before submission)
- [ ] Week 8: Submit early in week (allow time for rejection)

---

### 5.3 Quality Risks

#### Risk 9: Bugs Discovered Late

**Probability:** 50%  
**Impact:** 7/10 (poor launch, bad reviews)  
**Risk Score:** 3.5 (Medium-High)

**Description:**
Critical bugs found in Week 7-8 or post-launch damage reputation and require emergency fixes.

**Mitigation Strategy:**
- Test continuously (not just at the end)
- TestFlight beta for 2 weeks (Week 6-7)
- Diverse beta testers (devices, iOS versions, user types)
- Manual testing checklist (comprehensive)
- Crash reporting (Xcode Organizer, third-party if needed)

**Contingency Plan:**
If critical bugs found late:
- Week 7: Delay launch 1 week if needed
- Post-launch: Hotfix within 24 hours
- Communicate transparently with users

**Action Items:**
- [ ] Week 1-8: Test on device after every feature
- [ ] Week 6: Comprehensive manual testing
- [ ] Week 6-7: Beta testing with 30-50 users
- [ ] Week 8: Final regression testing

---

#### Risk 10: Poor Performance on Older Devices

**Probability:** 40%  
**Impact:** 6/10 (bad UX for subset of users)  
**Risk Score:** 2.4 (Medium)

**Description:**
App runs smoothly on iPhone 15 Pro but lags on iPhone SE or iPhone 12. Negative reviews.

**Mitigation Strategy:**
- Test on older device early (Week 3)
- Optimize images (thumbnails, compression)
- Profile with Instruments (Week 5)
- Lazy loading (don't load all data upfront)

**Contingency Plan:**
If performance issues on old devices:
- Add performance mode (reduced quality)
- Set minimum device requirement (iPhone 12+)
- Optimize critical paths

**Action Items:**
- [ ] Week 3: Test on iPhone SE (oldest supported device)
- [ ] Week 5: Performance profiling (Instruments)
- [ ] Week 6: Beta test on diverse devices

---

#### Risk 11: UX Issues Not Caught in Testing

**Probability:** 50%  
**Impact:** 5/10 (poor onboarding, low retention)  
**Risk Score:** 2.5 (Medium)

**Description:**
Developer bias: features make sense to you but confusing to users. Low retention, uninstalls.

**Mitigation Strategy:**
- User testing with non-technical friends/family
- Watch over their shoulder (don't guide them)
- Ask beta testers for UX feedback (survey)
- A/B test onboarding if possible

**Contingency Plan:**
If UX issues discovered:
- v1.0.1: UX improvements (1 week post-launch)
- Iterate based on feedback
- Add in-app guidance (tooltips, hints)

**Action Items:**
- [ ] Week 5: User testing with 3-5 non-tech users
- [ ] Week 6: Beta tester UX survey
- [ ] Week 7: Onboarding improvements based on feedback

---

## 6. Resource Requirements

### 6.1 Development Resources

#### Developer Hours

**Total Estimated Hours:** 320 hours over 8 weeks

**Breakdown:**
- Week 1: 40 hours (project setup, data model, photo capture)
- Week 2: 40 hours (entry creation, timeline view)
- Week 3: 40 hours (detail view, edit/delete)
- Week 4: 40 hours (settings, branding, dark mode)
- Week 5: 40 hours (onboarding, performance optimization)
- Week 6: 40 hours (polish, testing, TestFlight prep)
- Week 7: 40 hours (beta testing, bug fixes, App Store prep)
- Week 8: 40 hours (final testing, submission, launch)

**Daily Schedule:**
- 6 hours/day (sustainable pace)
- 5 days/week (Mon-Fri)
- Weekends: optional catch-up (not required)

**Realistic Adjustment:**
- Some days only 4 hours (meetings, distractions, life)
- Build in 20% buffer (some tasks take longer)
- Total: 8-10 weeks realistically

---

#### Development Environment Setup

**Hardware:**
- Mac (M1 or later recommended)
- iPhone (for testing, cannot rely on simulator)
  - Recommended: iPhone SE (test small screen/older chip)
  - Or borrow from friend

**Software:**
- Xcode 15+ (free)
- macOS Sonoma or later
- Git (free)
- Optional: GitHub Desktop (free, easier Git UI)

**Accounts:**
- Apple Developer Account: $99/year (required for TestFlight & App Store)
- GitHub account: free (for version control)

**Total Cost:** $99/year (Apple Developer)

---

#### Third-Party Libraries

**Goal for v1.0: ZERO dependencies**

**Why:**
- Faster compile times
- No dependency hell
- Full control over code
- Smaller app size
- No security vulnerabilities from third-party code

**What we CAN use (built-in):**
- SwiftData (data persistence)
- SwiftUI (UI framework)
- PhotosUI (photo picker)
- AVFoundation (camera)

**What we WON'T use (in v1.0):**
- Analytics (can add in v1.1 if needed)
- Crash reporting (use Xcode Organizer built-in)
- Image caching (build simple cache ourselves)

**Future (v1.1+):**
- Consider TelemetryDeck (privacy-friendly analytics)
- Consider Sentry (crash reporting)

---

### 6.2 Design Resources

#### Design Tools

**Recommended Setup (Free):**
- Figma Free Tier (UI mockups, icon design)
- Apple SF Symbols app (free icons)
- Preview.app (macOS, quick image editing)
- Canva Free (App Store screenshots)

**Paid Option ($):**
- Figma Pro: $12/month (overkill for v1.0)
- Sketch: $99/year (Mac-only, one-time)
- Adobe Creative Cloud: $55/month (professional, expensive)

**Recommendation:** Figma Free + SF Symbols (total: $0)

---

#### App Icon Design

**Option 1: DIY (Free, 6-8 hours)**
- Design in Figma or Sketch
- Use simple, recognizable shape
- Export at 1024x1024px
- Tools: Figma, Canva, Preview

**Option 2: Hire Designer ($50-150, 1 week)**
- Fiverr: $50-100 (varying quality)
- Upwork: $100-200 (higher quality)
- 99designs contest: $300+ (multiple options)

**Option 3: Use Template ($20-50, 1 hour)**
- App Icon Generator tools
- Customize colors/shapes
- Quick but less unique

**Recommendation for v1.0:**
- DIY initially (Week 4)
- If bad, hire designer ($100 budget)
- Icon can be updated post-launch (v1.0.1)

**Icon Concept Ideas (for "Grain"):**
- Film grain texture (nostalgic, analog)
- Camera lens with grain overlay
- Simple "G" lettermark
- Minimalist photo frame

---

#### App Store Screenshots

**Requirements:**
- 6.7" (iPhone 15 Pro Max): 3-6 screenshots (required)
- 5.5" (iPhone 8 Plus): 3-6 screenshots (optional, recommended)

**DIY Approach:**
1. Take screenshots in app (Cmd+S in simulator)
2. Add text overlay in Canva (free)
3. Highlight key features (1 screenshot = 1 feature)

**Example Screenshot Plan:**
1. Hero: "Your Daily Photo Diary" (timeline view)
2. Feature: "Capture Daily Moments" (camera view)
3. Feature: "Private & Local" (settings, privacy messaging)
4. Feature: "Beautiful Timeline" (grid view)
5. Social Proof: "Loved by 1,000+ Users" (if have reviews)

**Tools:**
- Screenshot Studio (Mac app, $20, nice templates)
- Canva (free, DIY)
- App Store Screenshot Generator (online, free)

**Time Estimate:** 4-6 hours (DIY)

**Recommendation:** DIY with Canva (Week 7)

---

#### App Preview Video

**Requirements:**
- Optional but highly recommended (increases conversions by 20-30%)
- Max 30 seconds
- 6.7" and 5.5" sizes

**DIY Approach:**
1. Record screen in simulator (Cmd+R)
2. Edit in iMovie (free, Mac)
3. Add text overlay, music (royalty-free)
4. Export in required sizes

**Paid Approach:**
- Hire on Fiverr: $50-150
- Faster, higher quality

**Time Estimate:** 6-8 hours (DIY)

**Recommendation for v1.0:**
- Optional: Skip for initial launch
- Add in v1.0.1 after analyzing conversion rate
- If time permits, DIY simple video (Week 7)

---

### 6.3 Testing Resources

#### TestFlight Beta Testers

**Target:** 30-50 testers

**Recruitment:**
- Friends/family: 10-15 (reliable, honest feedback)
- Twitter: 10-20 (post "looking for beta testers")
- Reddit (r/iOSBeta, r/SideProject): 10-20
- BetaList: 5-10 (submit app to directory)

**Incentives:**
- Free lifetime access (if you go subscription later)
- Early access to new features
- Recognition (thank you in App Store description)
- No monetary payment (against App Store rules)

**Management:**
- TestFlight groups (organize by cohort)
- Discord or WhatsApp group (async communication)
- Google Form for structured feedback

**Time Investment:** 4-6 hours/week during beta (Week 6-7)

---

#### Device Testing Matrix

**Minimum Testing Devices:**

| Device | iOS Version | Priority | Rationale |
|--------|-------------|----------|-----------|
| iPhone 15 Pro | 17.5 | High | Latest flagship |
| iPhone SE (2nd/3rd gen) | 17.0 | High | Oldest chip, smallest screen |
| iPhone 14 | 17.4 | Medium | Popular mid-range |
| iPhone 12 | 17.2 | Medium | Older chip, common device |
| Simulator | 17.0-18.0 | Low | Quick testing |

**Acquisition Strategy:**
- Use your own device (1 device)
- Borrow from friends/family (1-2 devices)
- Beta testers cover rest (distributed testing)

**Cost:** $0 (borrow) to $200 (buy used iPhone SE for testing)

---

#### iOS Version Testing

**Target iOS Versions:**
- Minimum: iOS 17.0 (SwiftData requirement)
- Recommended: iOS 17.2+ (bug fixes)
- Test on: 17.0, 17.4, 17.5, 18.0 beta (if available)

**Testing Strategy:**
- Simulator: quick testing on multiple iOS versions
- Physical device: test on oldest supported (17.0)
- Beta testers: natural distribution across versions

---

### 6.4 Marketing Resources

#### Landing Page

**Needed Before Launch:** Optional but recommended

**Options:**

**Option 1: Simple One-Pager (Free, 4 hours)**
- Tools: Carrd.co (free tier), Webflow (free)
- Content: App description, screenshots, App Store link
- Domain: $12/year (e.g., grainapp.com)

**Option 2: No Landing Page (Free, 0 hours)**
- Link directly to App Store
- Use Twitter/Reddit for marketing

**Recommendation for v1.0:**
- Skip landing page initially
- Add in v1.1 if traction is good
- Focus on App Store optimization (ASO)

---

#### Social Media Assets

**Platforms:**
- Twitter/X: primary (tech early adopters)
- Reddit: r/iOSapps, r/SideProject, r/productivity
- ProductHunt: high-quality launch day traffic

**Content Needed:**

**Pre-Launch (Week 6-7):**
- Teaser posts (3-5 tweets)
- Beta tester recruitment post
- Behind-the-scenes (development screenshots)

**Launch Day:**
- Launch tweet (pinned)
- ProductHunt post
- Reddit posts (3-4 subreddits, follow rules)

**Post-Launch (Week 9+):**
- Feature highlights (1/week)
- User testimonials (if have any)
- Update announcements

**Time Investment:** 6-8 hours (spread over Week 6-8)

**Tools:**
- Canva (create graphics, free)
- Buffer (schedule posts, free tier)

---

#### Press Kit

**Needed Before Launch:** Optional

**Contents:**
- App icon (high-res PNG)
- Screenshots (without device frames)
- App description (short + long)
- Founder story (if compelling)
- Press contact email

**Who to Send To:**
- Tech blogs (MacStories, 9to5Mac, iMore)
- Indie app curators (Apps Gone Free, AppRaven)
- Newsletters (iOS Dev Weekly, SwiftLee)

**Time Investment:** 4 hours (Week 7)

**Success Rate:** Low (<5% response rate) but worth a shot

**Recommendation:** Prepare simple press kit, send to 10-20 outlets, don't expect much

---

#### ProductHunt Preparation

**Why ProductHunt:**
- High-quality traffic (tech early adopters)
- Potential for 500-2,000 downloads on launch day
- Feedback from engaged community

**Preparation (Week 7):**
- ProductHunt account (free)
- Prepare post: tagline, description, thumbnail
- Schedule for Tuesday-Thursday (best launch days)
- Line up 5-10 friends to upvote in first hour (critical)

**Post Format:**
- Tagline: "A privacy-first photo diary for iPhone" (max 60 chars)
- Thumbnail: App icon or hero screenshot
- Gallery: 4-6 screenshots
- Description: Problem, solution, features, pricing

**Time Investment:** 3-4 hours (prepare post, respond to comments all day)

**Expected Results:**
- 50-200 upvotes (realistic for first launch)
- 200-1,000 visits
- 50-200 downloads

---

## 7. Launch Checklist

### 7.1 Pre-Launch (2 Weeks Before)

**Week 6 (2 Weeks Before Launch):**

- [ ] TestFlight build submitted
- [ ] Beta testers recruited (30-50 people)
- [ ] Beta testing feedback form created (Google Form)
- [ ] TestFlight group set up (Discord/WhatsApp)
- [ ] All P0 features complete and tested

---

**Week 7 (1 Week Before Launch):**

**App Store Submission:**
- [ ] All critical bugs from beta fixed
- [ ] App Store screenshots created (6.7" required)
- [ ] App Store description written
  - [ ] Subtitle (30 chars)
  - [ ] Short description (170 chars)
  - [ ] Full description
  - [ ] Keywords (100 chars, no spaces, commas)
  - [ ] Support URL
  - [ ] Privacy policy URL (required)
- [ ] App icon uploaded (1024x1024px)
- [ ] App Store pricing set ($4.99 USD)
- [ ] App Store category selected (Photo & Video or Lifestyle)
- [ ] Age rating completed (likely 4+)
- [ ] App Store submission sent to Apple

**Marketing Preparation:**
- [ ] ProductHunt post drafted
- [ ] Launch tweet drafted
- [ ] Reddit posts drafted (3-4 subreddits)
- [ ] Press kit prepared (icon, screenshots, description)
- [ ] 10-20 press contacts identified (blogs, newsletters)

**Support Preparation:**
- [ ] Support email set up (support@grainapp.com)
- [ ] Privacy policy written and published
- [ ] FAQ document created (5-10 common questions)
- [ ] Email templates for common support requests

---

### 7.2 Launch Week (Week 8)

**Monday-Tuesday: App Review Monitoring**
- [ ] Check App Store Connect daily for review status
- [ ] Respond to App Review questions within 24 hours (if any)
- [ ] Fix any rejection issues immediately

**Wednesday: Pre-Launch Final Checks**
- [ ] App approved and "Pending Developer Release"
- [ ] Final smoke test on App Store build (download via TestFlight)
- [ ] ProductHunt post scheduled for Thursday 12:01 AM PST
- [ ] Launch tweet scheduled
- [ ] Reddit posts ready to post
- [ ] Friends/supporters alerted for ProductHunt upvotes

**Thursday: Launch Day!**

**Morning (8-10 AM PST):**
- [ ] Release app on App Store ("Release" button in App Store Connect)
- [ ] Verify app is live on App Store
- [ ] Post launch tweet (with App Store link)
- [ ] Pin launch tweet to profile
- [ ] ProductHunt post live (if not auto-posted)
- [ ] Ask 5-10 friends to upvote ProductHunt in first hour
- [ ] Post to Reddit:
  - [ ] r/iOSapps
  - [ ] r/SideProject
  - [ ] r/productivity
  - [ ] r/Apple (read rules carefully)

**Afternoon (10 AM - 6 PM PST):**
- [ ] Monitor ProductHunt comments (respond within 1 hour)
- [ ] Monitor Reddit comments (respond within 1 hour)
- [ ] Monitor Twitter mentions (respond within 1 hour)
- [ ] Monitor App Store reviews (respond within 24 hours)
- [ ] Send press kit to 10-20 press contacts

**Evening (6-10 PM PST):**
- [ ] Final ProductHunt comment responses
- [ ] Celebrate! (You launched!)
- [ ] Take screenshots of metrics (downloads, upvotes, reviews)

**Friday: Post-Launch Day 1**
- [ ] Monitor App Store crash reports (Xcode Organizer)
- [ ] Monitor App Store reviews (respond to all)
- [ ] Thank early supporters (Twitter, ProductHunt)
- [ ] Post "Thank you" tweet with Day 1 stats

---

### 7.3 Post-Launch (Week 9+)

**Week 9: Post-Launch Monitoring**

**Daily (First Week):**
- [ ] Check App Store crash reports (Xcode Organizer)
- [ ] Respond to App Store reviews (all reviews, < 24 hours)
- [ ] Monitor Twitter mentions
- [ ] Track key metrics:
  - Downloads
  - Purchases (conversion rate)
  - Crash-free rate
  - Average rating
  - Refund rate

**Metrics Tracking:**
- App Store Connect (downloads, revenue, crashes)
- Spreadsheet (daily log):
  - Date | Downloads | Purchases | Revenue | Crash Rate | Rating

**Support:**
- [ ] Respond to support emails within 24 hours
- [ ] Document common issues (FAQ updates)
- [ ] Escalate critical bugs (immediate hotfix if needed)

---

**Week 10+: Iteration Planning**

**Analyze Launch Data:**
- [ ] Download count vs. goal (goal: 1,000+ in first month)
- [ ] Conversion rate (goal: 2-3%)
- [ ] Retention rate (Day 7, Day 30)
- [ ] App Store rating (goal: 4.5+ stars)
- [ ] Top user complaints (reviews, support emails)
- [ ] Top feature requests

**Plan v1.0.1 Hotfix (If Needed):**
- Critical bugs found post-launch
- Quick UX improvements
- Timeline: 1-2 weeks

**Plan v1.1 (Major Update):**
- Based on user feedback
- Add P1 features (export, search, widgets, etc.)
- Gamification elements (streaks, achievements)
- Timeline: 1-2 months after v1.0 launch

---

## 8. Success Metrics for v1.0

### 8.1 Technical Metrics

**Crash-Free Rate:**
- Goal: >99.5%
- Measurement: Xcode Organizer (App Store Connect)
- Action if below goal: Immediate hotfix (v1.0.1)

**App Size:**
- Goal: <50 MB (download size)
- Measurement: App Store Connect (final build)
- Why important: Users on limited data plans
- Action if above goal: Optimize assets, remove unused code

**Launch Time:**
- Goal: <2 seconds (cold launch)
- Measurement: Instruments (Time Profiler)
- Test on: iPhone SE (slowest supported device)
- Action if above goal: Optimize startup code, lazy load data

**Photo Capture Time:**
- Goal: <1 second (tap camera → photo saved)
- Measurement: Manual testing (stopwatch)
- Action if above goal: Optimize photo compression, async operations

**Memory Usage:**
- Goal: <100 MB (timeline with 100+ entries)
- Measurement: Instruments (Allocations, Leaks)
- Action if above goal: Fix memory leaks, optimize image caching

---

### 8.2 User Metrics

**Downloads:**
- Goal: 1,000+ downloads in first month
- Stretch goal: 5,000+ downloads
- Measurement: App Store Connect

**Conversion Rate (Free → Paid):**
- Goal: 2-3%
- Calculation: (Purchases / Downloads) × 100
- Industry standard: 1-3% for paid apps
- Measurement: App Store Connect
- Action if below goal: Improve onboarding, add value messaging

**Day 7 Retention:**
- Goal: 50%+
- Calculation: % of users who open app 7 days after install
- Measurement: App Store Connect (Analytics)
- Action if below goal: Improve onboarding, add engagement features

**Day 30 Retention:**
- Goal: 25%+
- Calculation: % of users who open app 30 days after install
- Measurement: App Store Connect (Analytics)
- Action if below goal: v1.1 add gamification (streaks, reminders)

**Active Users (Monthly):**
- Goal: 500+ MAU by end of Month 1
- Measurement: App Store Connect (Analytics)

---

### 8.3 Business Metrics

**Revenue:**
- Goal: $5,000+ in first month
- Calculation: 1,000 downloads × 2.5% conversion × $4.99 = ~$125
  - (Revised realistic goal: $500-1,000 first month)
- Stretch goal: $5,000 (requires 25,000 downloads × 2% conversion)
- Measurement: App Store Connect (Sales & Trends)

**App Store Rating:**
- Goal: 4.5+ stars (average)
- Minimum: 4.0+ stars
- Measurement: App Store Connect
- Action if below goal: Fix top complaints, improve UX

**Number of Reviews:**
- Goal: 50+ reviews in first month
- Why important: Social proof, increases downloads
- Action to increase: Prompt for review after 3-day use (v1.1)
- Measurement: App Store Connect

**Refund Rate:**
- Goal: <5%
- Calculation: (Refunds / Purchases) × 100
- Industry standard: 3-10%
- Measurement: App Store Connect
- Action if above goal: Investigate reasons (reviews, support emails)

**Customer Acquisition Cost (CAC):**
- Goal: $0 (organic only in v1.0)
- Future: If run ads, CAC < $2.00 (break even at $4.99)

**Lifetime Value (LTV):**
- v1.0: $4.99 (one-time purchase)
- Future: If add subscription, target LTV > $20

---

### 8.4 Success Benchmarks

**Minimum Viable Success (v1.0):**
- 1,000+ downloads in Month 1
- $500-1,000 revenue
- 4.0+ star rating
- <1% crash rate
- 30%+ Day 7 retention

**Good Success (v1.0):**
- 5,000+ downloads in Month 1
- $2,500-5,000 revenue
- 4.5+ star rating
- <0.5% crash rate
- 50%+ Day 7 retention
- ProductHunt: Top 10 of the day

**Exceptional Success (v1.0):**
- 10,000+ downloads in Month 1
- $10,000+ revenue
- 4.8+ star rating
- <0.1% crash rate
- 60%+ Day 7 retention
- ProductHunt: Top 3 of the day
- Press coverage (MacStories, 9to5Mac, etc.)

---

## 9. Post-MVP Roadmap Preview

### 9.1 v1.0.1 - Hotfix/Quick Wins (Week 10-11)

**Timeline:** 1-2 weeks after v1.0 launch

**Goals:**
- Fix critical bugs from v1.0
- Quick UX improvements based on feedback
- Low-hanging fruit features

**Potential Features:**
- Bug fixes (based on crash reports)
- Export to PDF (if highly requested)
- App Store review prompt (increase reviews)
- Minor UX improvements (based on user feedback)
- Performance optimizations (if needed)

**Scope:** Small, focused on polish

---

### 9.2 v1.1 - Gamification & Engagement (Month 3-4)

**Timeline:** 2-3 months after v1.0 launch

**Goals:**
- Increase retention (Day 30 goal: 40%+)
- Add engagement features
- Differentiate from competitors

**Planned Features:**

**Gamification:**
- Streak counter ("7 days in a row!")
- Achievement badges (First entry, 30-day streak, etc.)
- Progress indicators (30/365 days documented)
- Milestone celebrations (confetti animation on 100th entry)

**Widgets:**
- Home Screen widget: Today's photo + streak counter
- Lock Screen widget: Streak counter

**Enhanced Viewing:**
- Calendar view (monthly grid with dots on entry days)
- Search functionality (search notes by keyword)
- Filters (show only entries with notes, date range)

**Export:**
- Export all entries to PDF (photo book style)
- Export photos to Photos app (bulk)
- Share individual entry (photo + note as image)

**Scope:** Medium (4-6 weeks development)

---

### 9.3 v1.2 - Soft Nudges & Reminders (Month 5-6)

**Timeline:** 4-5 months after v1.0 launch

**Goals:**
- Improve daily habit formation
- Increase MAU (Monthly Active Users)
- Add gentle reminders (not pushy)

**Planned Features:**

**Notifications:**
- Daily reminder ("Time for your daily photo!")
- Customizable reminder time
- Smart reminders (only if haven't taken photo today)
- Streak at risk notification ("Don't break your 20-day streak!")

**Soft Nudges:**
- In-app prompt if haven't taken photo by evening
- Gentle encouragement messages
- No annoying/frequent notifications (respect user)

**Enhanced Settings:**
- Notification preferences (on/off, time, frequency)
- Quiet hours (don't remind during sleep)
- Weekend mode (skip weekends if desired)

**Scope:** Small-Medium (2-3 weeks development)

---

### 9.4 v1.5+ - Advanced Features (Month 7+)

**Timeline:** 6+ months after v1.0 launch

**Goals:**
- Explore new revenue streams (subscription?)
- Add power user features
- Expand platform (iPad, Mac, Watch?)

**Potential Features (Not Committed):**

**Time Delay Feature:**
- Take photo now, view it in 1 year ("time capsule")
- "On this day" memories (view entry from 1 year ago)

**iCloud Sync:**
- Sync across iPhone, iPad, Mac
- Conflict resolution
- CloudKit integration

**Multiple Photos Per Day:**
- Option to relax "one photo per day" rule
- Grid of photos for a single day
- (Decision: does this dilute core concept?)

**App Blocking Integration:**
- Block social media after taking daily photo
- Reward system (unlock apps after journaling)
- (Decision: too complex? separate app?)

**Premium Subscription ($):**
- Unlimited storage (if add cloud sync)
- Premium themes/filters
- Priority support
- (Decision: one-time purchase vs subscription trade-off)

**Platform Expansion:**
- iPad version (larger screen, better for viewing)
- Mac version (Catalyst or native)
- Apple Watch complication (streak counter)

**Social Features (?):**
- Share streak with friends (privacy concern)
- Private groups (family photo diary)
- (Decision: conflicts with "privacy-first" positioning)

---

### 9.5 Roadmap Decision Points

**During v1.0 Development:**

**Keep Architecture Extensible For:**
- Additional data fields (tags, location, mood)
- Multiple photos per entry (data model can support)
- Sync (repository pattern makes this easier)
- Achievements (new data model for badges)

**Don't Over-Engineer:**
- No premature optimization
- No complex abstractions "just in case"
- YAGNI (You Ain't Gonna Need It)

**Document Extension Points:**
- README: Future feature considerations
- Code comments: "Hook for achievements in v1.1"
- Architecture diagram: Where features fit

**v1.1 Planning Starts in Week 6:**
- While in beta testing
- Based on early user feedback
- Informal planning (no detailed spec yet)

---

## 10. Daily/Weekly Schedule Template

### 10.1 Solo Developer Work Schedule

**Realistic Daily Hours:**
- **Target:** 6 hours/day of focused work
- **Why 6, not 8:** Account for breaks, context switching, meetings, interruptions
- **Buffer:** Some days only 4 hours (life happens)

**Work Schedule:**
- **Weekdays (Mon-Fri):** 6 hours/day = 30 hours/week
- **Weekends:** Optional (catch-up only if behind)
- **Preferred:** 1 day off/week (prevent burnout)

**Daily Schedule Example:**
```
9:00 AM - 9:30 AM: Review plan, check yesterday's progress
9:30 AM - 12:00 PM: Deep work block 1 (2.5 hours)
12:00 PM - 1:00 PM: Lunch, walk, break
1:00 PM - 3:30 PM: Deep work block 2 (2.5 hours)
3:30 PM - 4:00 PM: Testing, code review, cleanup
4:00 PM - 4:30 PM: Plan tomorrow, log progress
4:30 PM: Done for the day
```

**Weekly Schedule:**
- **Monday:** Sprint planning (30 min) + development
- **Tuesday-Thursday:** Pure development (6h/day)
- **Friday:** Sprint review + retrospective (1h) + development (5h)
- **Saturday:** Off (or catch-up if behind)
- **Sunday:** Off (or planning next week)

---

### 10.2 Detailed 8-Week Schedule

---

### **WEEK 1: Foundation**

**Goal:** Project setup, data model, photo capture working

**Monday (40 hours total this week)**
- 9:00-9:30: Sprint planning, set up workspace
- 9:30-12:00: Create Xcode project, configure settings (iOS 17+, SwiftUI, SwiftData)
- 12:00-1:00: Lunch
- 1:00-3:00: Project structure (folders: Models, Views, ViewModels, Services, Repositories)
- 3:00-4:00: Git repository setup (.gitignore, initial commit)
- 4:00-4:30: README.md, document architecture decisions

**Tuesday**
- 9:00-12:00: Design SwiftData model (DiaryEntry)
- 12:00-1:00: Lunch
- 1:00-3:30: Repository pattern skeleton (protocol + implementation)
- 3:30-4:30: File storage structure (Documents/Photos/YYYY/MM/)

**Wednesday**
- 9:00-12:00: PhotoCaptureService (UIImagePickerController integration)
- 12:00-1:00: Lunch
- 1:00-3:00: Camera permission handling (Info.plist, request flow)
- 3:00-4:30: Build simple camera view (tap button → open camera)

**Thursday**
- 9:00-12:00: PhotoStorageService (save UIImage as HEIC to disk)
- 12:00-1:00: Lunch
- 1:00-3:30: Integration: capture photo → save to disk → create DiaryEntry
- 3:30-4:30: Write unit tests (PhotoStorageService, Repository)

**Friday**
- 9:00-11:00: Test on physical device (iPhone)
- 11:00-12:00: Fix bugs from device testing
- 12:00-1:00: Lunch
- 1:00-2:30: Code review (self-review PR), cleanup
- 2:30-3:30: Sprint review (what worked? what didn't?)
- 3:30-4:00: Retrospective, plan Week 2

**Weekend (Optional)**
- Saturday: Off (or catch-up if behind on Friday's tasks)
- Sunday: Plan Week 2, review progress

**Week 1 Deliverables:**
- ✅ Xcode project set up, compiles
- ✅ SwiftData model created (DiaryEntry)
- ✅ Can take photo with device camera
- ✅ Photo saves to local storage (HEIC format)
- ✅ Git repo with clean commit history

---

### **WEEK 2: Entry Creation & Timeline**

**Goal:** Create entry flow, timeline view showing entries

**Monday**
- 9:00-12:00: CreateEntryView UI (photo preview, text note input)
- 12:00-1:00: Lunch
- 1:00-3:30: CreateEntryViewModel (handle save, validation)
- 3:30-4:30: Wire up view to ViewModel

**Tuesday**
- 9:00-11:00: Implement one-entry-per-day validation (repository layer)
- 11:00-12:00: Error handling (show alert if duplicate entry)
- 12:00-1:00: Lunch
- 1:00-3:30: CreateEntryUseCase (business logic)
- 3:30-4:30: Write unit tests (use case, validation)

**Wednesday**
- 9:00-12:00: TimelineView UI (List or LazyVGrid)
- 12:00-1:00: Lunch
- 1:00-3:30: EntryRowView (cell design: thumbnail, date, note preview)
- 3:30-4:30: Empty state view ("Take your first photo!")

**Thursday**
- 9:00-12:00: TimelineViewModel (load entries from SwiftData with @Query)
- 12:00-1:00: Lunch
- 1:00-3:00: Image loading (AsyncImage with caching)
- 3:00-4:30: Navigation (tap row → nothing yet, placeholder)

**Friday**
- 9:00-11:00: Integration testing (create entry → see in timeline)
- 11:00-12:00: Bug fixes
- 12:00-1:00: Lunch
- 1:00-2:30: Polish UI (spacing, fonts, colors)
- 2:30-3:30: Sprint review
- 3:30-4:00: Retrospective, plan Week 3

**Weekend (Optional)**
- Off or catch-up

**Week 2 Deliverables:**
- ✅ Can create entry (photo + text note)
- ✅ Timeline view shows all entries
- ✅ One-entry-per-day validation works
- ✅ Basic app flow works end-to-end

---

### **WEEK 3: Detail View & Edit/Delete**

**Goal:** View, edit, delete entries

**Monday**
- 9:00-12:00: EntryDetailView UI (full photo, full note, metadata)
- 12:00-1:00: Lunch
- 1:00-3:30: ZoomablePhotoView (pinch-to-zoom gesture)
- 3:30-4:30: Navigation (timeline → detail view)

**Tuesday**
- 9:00-11:00: EntryDetailViewModel (load entry, state management)
- 11:00-12:00: Polish detail view layout (spacing, readability)
- 12:00-1:00: Lunch
- 1:00-4:00: Test navigation flow, fix bugs

**Wednesday**
- 9:00-12:00: EditEntryView (modal sheet with text editor)
- 12:00-1:00: Lunch
- 1:00-3:30: EditEntryViewModel (update logic)
- 3:30-4:30: Wire up edit flow (detail → edit → save → back)

**Thursday**
- 9:00-11:00: Delete functionality (repository method)
- 11:00-12:00: Delete photo file from disk (cleanup)
- 12:00-1:00: Lunch
- 1:00-2:30: Swipe-to-delete in timeline (SwiftUI .swipeActions)
- 2:30-4:00: Delete button in detail view (with confirmation alert)
- 4:00-4:30: Test delete flow

**Friday**
- 9:00-11:00: Test all CRUD operations (Create, Read, Update, Delete)
- 11:00-12:00: Bug fixes (edge cases: delete last entry, edit empty note, etc.)
- 12:00-1:00: Lunch
- 1:00-2:30: Polish animations (delete animation, navigation transitions)
- 2:30-3:30: Sprint review
- 3:30-4:00: Retrospective, plan Week 4

**Weekend (Optional)**
- Off or catch-up

**Week 3 Deliverables:**
- ✅ Entry detail view fully functional
- ✅ Can edit entry text note
- ✅ Can delete entry (both ways: swipe, button)
- ✅ All CRUD operations working smoothly

---

### **WEEK 4: Settings, Branding, Dark Mode**

**Goal:** Settings screen, app icon, color scheme, dark mode

**Monday**
- 9:00-12:00: SettingsView UI (Form with sections)
- 12:00-1:00: Lunch
- 1:00-3:30: SettingsManager (UserDefaults wrapper)
- 3:30-4:30: Settings options (default camera, photo quality)

**Tuesday**
- 9:00-11:00: Settings: app version, privacy policy link, support link
- 11:00-12:00: Privacy policy (write simple policy, host on GitHub Pages or in-app)
- 12:00-1:00: Lunch
- 1:00-3:00: Settings: iCloud sync toggle (UI only, no implementation yet)
- 3:00-4:00: Test settings persistence

**Wednesday**
- 9:00-12:00: App icon design (Figma or hire designer)
  - Option A: DIY in Figma (6 hours)
  - Option B: Commission on Fiverr (1 hour to brief, wait for delivery)
- 12:00-1:00: Lunch
- 1:00-3:30: Color scheme definition (primary, secondary, accent colors)
- 3:30-4:30: Create Color assets in Xcode (semantic colors)

**Thursday**
- 9:00-12:00: Apply branding throughout app (colors, typography)
- 12:00-1:00: Lunch
- 1:00-3:30: Dark mode color definitions (semantic colors)
- 3:30-4:30: Test all screens in dark mode (simulator)

**Friday**
- 9:00-11:00: Dark mode fixes (text contrast, image backgrounds)
- 11:00-12:00: Visual polish (spacing, alignment, consistency)
- 12:00-1:00: Lunch
- 1:00-2:30: Test on device (light + dark mode)
- 2:30-3:30: Sprint review
- 3:30-4:00: Retrospective, plan Week 5

**Weekend (Optional)**
- Off or catch-up

**Week 4 Deliverables:**
- ✅ Settings screen functional
- ✅ App icon designed and added
- ✅ Cohesive color scheme applied
- ✅ Dark mode fully supported

---

### **WEEK 5: Onboarding & Performance**

**Goal:** Onboarding flow, performance optimization, UX polish

**Monday**
- 9:00-12:00: Onboarding screen designs (3 pages: Welcome, How It Works, Permissions)
- 12:00-1:00: Lunch
- 1:00-3:30: OnboardingContainerView (TabView with PageTabViewStyle)
- 3:30-4:30: OnboardingPageView (reusable component)

**Tuesday**
- 9:00-11:00: Onboarding flow logic (first launch detection with UserDefaults)
- 11:00-12:00: Onboarding integration (.fullScreenCover on app launch)
- 12:00-1:00: Lunch
- 1:00-3:30: Permission requests during onboarding (camera permission)
- 3:30-4:30: Test onboarding flow (first launch, skip, complete)

**Wednesday**
- 9:00-11:00: Performance audit (Instruments: Time Profiler)
- 11:00-12:00: Optimize app launch time (lazy load views, defer work)
- 12:00-1:00: Lunch
- 1:00-3:00: Image loading performance (implement simple cache)
- 3:00-4:00: Timeline scrolling performance (test with 100+ entries)
- 4:00-4:30: Memory profiling (Instruments: Allocations)

**Thursday**
- 9:00-12:00: Fix memory leaks (if any found)
- 12:00-1:00: Lunch
- 1:00-3:30: Optimize image caching (thumbnail generation)
- 3:30-4:30: Test performance on iPhone SE (oldest device)

**Friday**
- 9:00-11:00: UX polish pass (animations, transitions, haptics)
- 11:00-12:00: Add subtle animations (button press, list item appear)
- 12:00-1:00: Lunch
- 1:00-2:30: Final polish (micro-interactions, loading states)
- 2:30-3:30: Sprint review
- 3:30-4:00: Retrospective, plan Week 6

**Weekend**
- Prep for beta testing (recruit testers, create feedback form)

**Week 5 Deliverables:**
- ✅ Onboarding flow complete
- ✅ App performs smoothly (60fps, <2s launch)
- ✅ Memory optimized (<100 MB)
- ✅ UX feels polished

---

### **WEEK 6: Testing & TestFlight**

**Goal:** Comprehensive testing, TestFlight beta submission

**Monday**
- 9:00-11:00: Accessibility audit (VoiceOver, Dynamic Type)
- 11:00-12:00: Fix accessibility issues (labels, hints, contrast)
- 12:00-1:00: Lunch
- 1:00-4:00: Manual testing checklist (go through every feature)
  - Create entry
  - View timeline
  - View detail
  - Edit entry
  - Delete entry
  - Settings
  - Onboarding
  - Dark mode
  - Edge cases (no entries, 100+ entries, etc.)

**Tuesday**
- 9:00-12:00: Fix bugs found in manual testing
- 12:00-1:00: Lunch
- 1:00-4:00: More bug fixes (prioritize P0 bugs)

**Wednesday**
- 9:00-11:00: Final UI polish (spacing, alignment, fonts)
- 11:00-12:00: Test on multiple devices (if available)
- 12:00-1:00: Lunch
- 1:00-3:00: Prepare TestFlight build (bump version to 1.0.0, build number)
- 3:00-4:00: Archive and upload to App Store Connect
- 4:00-4:30: TestFlight: add testers, write release notes

**Thursday**
- 9:00-10:00: Recruit beta testers (Twitter, Reddit, friends)
- 10:00-11:00: Create beta testing feedback form (Google Form)
- 11:00-12:00: Set up Discord/WhatsApp group for testers
- 12:00-1:00: Lunch
- 1:00-2:00: TestFlight build approved, send invites to testers
- 2:00-4:00: Monitor initial feedback (first few testers)

**Friday**
- 9:00-11:00: Start on App Store prep (while testers test)
- 11:00-12:00: Write App Store description (draft)
- 12:00-1:00: Lunch
- 1:00-2:30: App Store keywords research (ASO)
- 2:30-3:30: Sprint review
- 3:30-4:00: Retrospective, plan Week 7

**Weekend**
- Monitor beta tester feedback
- Fix critical bugs if needed

**Week 6 Deliverables:**
- ✅ Feature-complete app
- ✅ All P0 features working
- ✅ TestFlight beta live
- ✅ 30-50 beta testers recruited

---

### **WEEK 7: Beta Testing & App Store Prep**

**Goal:** Fix bugs from beta, create App Store assets

**Monday**
- 9:00-11:00: Review beta tester feedback (form responses, Discord comments)
- 11:00-12:00: Prioritize bugs (P0 must fix, P1 nice to fix)
- 12:00-1:00: Lunch
- 1:00-4:00: Fix P0 bugs from beta testing

**Tuesday**
- 9:00-12:00: Fix more bugs (P0 and P1)
- 12:00-1:00: Lunch
- 1:00-3:00: Submit TestFlight build 2 (if needed, with bug fixes)
- 3:00-4:00: Monitor feedback on build 2

**Wednesday**
- 9:00-11:00: Create App Store screenshots (Canva or Screenshot Studio)
  - 6.7" (iPhone 15 Pro Max): 5-6 screenshots
  - 5.5" (iPhone 8 Plus): 5-6 screenshots (optional)
- 11:00-12:00: Write screenshot captions (1 sentence per screenshot)
- 12:00-1:00: Lunch
- 1:00-4:00: App Store preview video (optional, if time permits)
  - Record screen in simulator
  - Edit in iMovie
  - Add text overlay, background music

**Thursday**
- 9:00-11:00: Finalize App Store description
  - Subtitle (30 chars)
  - Description (4,000 chars max)
  - Keywords (100 chars, comma-separated, no spaces)
- 11:00-12:00: App Store metadata (support URL, privacy policy URL, category, age rating)
- 12:00-1:00: Lunch
- 1:00-3:00: Create press kit (app icon, screenshots, description, press contact)
- 3:00-4:00: Identify 10-20 press contacts (blogs, newsletters)

**Friday**
- 9:00-11:00: Draft ProductHunt post (tagline, description, gallery)
- 11:00-12:00: Draft launch tweet (pinned tweet for launch day)
- 12:00-1:00: Lunch
- 1:00-2:00: Draft Reddit posts (3-4 subreddits)
- 2:00-3:00: Final TestFlight check (all critical bugs fixed?)
- 3:00-3:30: Sprint review
- 3:30-4:00: Retrospective, plan Week 8 (launch week!)

**Weekend**
- Prepare for launch week (schedule posts, alert supporters)

**Week 7 Deliverables:**
- ✅ All critical bugs fixed
- ✅ Beta testers happy with stability
- ✅ App Store screenshots complete
- ✅ App Store description finalized
- ✅ Marketing materials ready

---

### **WEEK 8: App Store Submission & Launch**

**Goal:** Submit to App Store, launch publicly

**Monday**
- 9:00-11:00: Final testing (smoke test on latest TestFlight build)
- 11:00-12:00: Test on multiple devices (if available)
- 12:00-1:00: Lunch
- 1:00-3:00: Submit to App Store (App Store Connect)
  - Upload build
  - Add screenshots
  - Add description
  - Set pricing ($4.99)
  - Submit for review
- 3:00-4:00: Monitor submission status (wait for "In Review")

**Tuesday**
- 9:00-11:00: Write privacy policy (final version, publish online)
- 11:00-12:00: Write FAQ document (5-10 common questions)
- 12:00-1:00: Lunch
- 1:00-3:00: Set up support email (support@grainapp.com)
- 3:00-4:00: Prepare email templates for common support requests

**Wednesday**
- 9:00-12:00: Monitor App Review status
  - If approved: Move to Thursday tasks early
  - If in review: Work on marketing prep
  - If rejected: Fix issues, resubmit immediately
- 12:00-1:00: Lunch
- 1:00-4:00: Final marketing prep
  - ProductHunt post ready
  - Launch tweet ready
  - Reddit posts ready
  - Press emails ready

**Thursday (Launch Day!)**
- 8:00-9:00: Release app on App Store ("Release" button in App Store Connect)
- 9:00-9:30: Verify app is live, download it yourself
- 9:30-10:00: Post launch tweet (with App Store link)
- 10:00-10:30: Post to ProductHunt (or schedule for 12:01 AM PST)
- 10:30-11:00: Ask 5-10 friends to upvote ProductHunt (first hour critical)
- 11:00-12:00: Post to Reddit (r/iOSapps, r/SideProject, r/productivity, r/Apple)
- 12:00-1:00: Lunch
- 1:00-3:00: Monitor ProductHunt comments (respond quickly)
- 3:00-4:00: Monitor Reddit comments (respond quickly)
- 4:00-6:00: Send press kit to 10-20 press contacts
- 6:00-8:00: Monitor Twitter mentions, App Store reviews
- 8:00 PM: Celebrate! You launched! 🎉

**Friday (Post-Launch Day 1)**
- 9:00-10:00: Check App Store crash reports (Xcode Organizer)
- 10:00-11:00: Respond to all App Store reviews (thank positive, address negative)
- 11:00-12:00: Thank early supporters (Twitter, ProductHunt)
- 12:00-1:00: Lunch
- 1:00-2:00: Monitor metrics (downloads, purchases, crashes)
- 2:00-3:00: Post "Thank you" tweet with Day 1 stats
- 3:00-4:00: Reflect on launch, document lessons learned

**Weekend**
- Rest! You earned it.
- Optional: Monitor reviews, respond to support emails

**Week 8 Deliverables:**
- ✅ App live on App Store
- ✅ Launch marketing executed
- ✅ ProductHunt post live
- ✅ Social media announcements made
- ✅ Press contacts reached out to
- ✅ Support channels ready

---

## 11. Appendices

### Appendix A: Tools & Resources

**Development:**
- Xcode 15+ (free)
- SwiftLint (free, brew install swiftlint)
- Git (free)
- GitHub (free for public repos)

**Design:**
- Figma (free tier)
- SF Symbols (free, Apple)
- Canva (free tier)

**Testing:**
- TestFlight (free, built into App Store Connect)
- Instruments (free, built into Xcode)

**Marketing:**
- ProductHunt (free to post)
- Buffer (free tier for scheduling)
- Google Forms (free for feedback)

**Total Cost:** $99/year (Apple Developer account)

---

### Appendix B: Key Decisions Log

**Decision 1: SwiftData vs Core Data**
- **Chosen:** SwiftData
- **Rationale:** Modern, cleaner API, less boilerplate
- **Trade-off:** iOS 17+ requirement, less mature
- **Fallback:** Core Data if SwiftData has critical issues

**Decision 2: MVVM vs MVC**
- **Chosen:** MVVM + Repository pattern
- **Rationale:** Better separation of concerns, testability
- **Trade-off:** More files, slightly more complex

**Decision 3: One-time purchase vs Subscription**
- **Chosen:** $4.99 one-time purchase (v1.0)
- **Rationale:** Simpler, aligns with "privacy-first" (no ongoing data costs)
- **Future:** May add subscription tier in v1.5+ for cloud sync

**Decision 4: iOS 17+ only**
- **Chosen:** iOS 17+ (SwiftData requirement)
- **Trade-off:** Smaller addressable market (~30-40% of iOS users)
- **Rationale:** Worth it for modern API, target early adopters

**Decision 5: No third-party dependencies**
- **Chosen:** Zero dependencies in v1.0
- **Rationale:** Faster compile, full control, no security risk
- **Trade-off:** Build some features ourselves (image cache, etc.)

---

### Appendix C: Contact & Support

**Support Email:** support@grainapp.com (set up in Week 7)

**Privacy Policy:** https://[your-domain]/privacy (publish in Week 7)

**Press Contact:** press@grainapp.com (same inbox as support, or separate)

**Social Media:**
- Twitter: @grainapp (create in Week 6)
- ProductHunt: [profile link]

---

## END OF DEVELOPMENT PLAN

---

**Next Steps:**
1. Review this plan thoroughly
2. Adjust timeline if needed (8 weeks aggressive, 10 weeks safer)
3. Set up development environment (Xcode, GitHub)
4. Start Week 1 on [INSERT START DATE]
5. Ship v1.0 on [INSERT LAUNCH DATE]

**Good luck building Grain! 🌾**

