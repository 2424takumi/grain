# Week 1 Quick Start Guide

Ready to start building Grain? Here's everything you need to get started on Day 1.

---

## Pre-Development Setup (Do This First!)

### 1. Apple Developer Account
- [ ] Go to https://developer.apple.com
- [ ] Sign up for Apple Developer Program ($99/year)
- [ ] Wait for approval (usually 24-48 hours)
- [ ] **Note:** You can start development while waiting, but you'll need this for TestFlight and App Store submission

### 2. Development Environment
- [ ] Ensure you have macOS Sonoma or later
- [ ] Install Xcode 15+ from Mac App Store (free)
- [ ] Open Xcode, install additional components (if prompted)
- [ ] Test Xcode: Create a new iOS app, run in simulator to verify it works

### 3. Git & GitHub
- [ ] Install Git (comes with macOS, or `brew install git`)
- [ ] Create GitHub account (if you don't have one)
- [ ] Configure Git:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 4. Optional Tools
- [ ] Install SwiftLint: `brew install swiftlint`
- [ ] Install GitHub Desktop (optional, easier Git UI)
- [ ] Create Figma account (free) for design work

---

## Day 1: Monday - Project Setup

**Goal:** Create Xcode project, configure settings, set up Git

### Morning (2.5 hours)

**Step 1: Create Xcode Project (30 min)**
1. Open Xcode
2. File → New → Project
3. Select "App" template
4. Configure:
   - Product Name: `Grain`
   - Team: Select your Apple Developer account team
   - Organization Identifier: `com.yourname` (e.g., `com.johndoe`)
   - Bundle Identifier: `com.yourname.Grain`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: **SwiftData** (IMPORTANT!)
   - Include Tests: ✅ Yes
5. Choose location: `/Users/[your-username]/Documents/grain/GrainApp`
6. Create Git repository: ✅ Yes (Xcode will initialize Git)
7. Click "Create"

**Step 2: Configure Project Settings (30 min)**
1. Select project in navigator → General tab
2. Set iOS Deployment Target: **iOS 17.0**
3. Set Supported Destinations: **iPhone** only (uncheck iPad for now)
4. Signing & Capabilities:
   - Automatically manage signing: ✅ Yes
   - Team: Select your team
5. Build Settings:
   - Search "Swift Language Version": Ensure **Swift 5**

**Step 3: Project Structure (1 hour)**
1. In Project Navigator, create folder structure:
   ```
   Grain/
   ├── App/
   │   └── GrainApp.swift (move existing file here)
   ├── Models/
   ├── Views/
   │   ├── Timeline/
   │   ├── EntryDetail/
   │   ├── CreateEntry/
   │   ├── EditEntry/
   │   ├── Settings/
   │   ├── Onboarding/
   │   └── Shared/
   ├── ViewModels/
   ├── Services/
   ├── Repositories/
   ├── UseCases/
   └── Resources/
       └── Assets.xcassets (existing)
   ```

2. Right-click `Grain` folder → New Group (for each folder above)
3. Drag `GrainApp.swift` into `App/` folder

**Step 4: Test Build (30 min)**
1. Select simulator: iPhone 15 Pro (iOS 17.5)
2. Press Cmd+R (Run)
3. Verify app launches (shows "Hello, world!")
4. If errors: Fix them (likely signing issues or missing team)

---

### Lunch Break (1 hour)

Relax! You've got the foundation set up.

---

### Afternoon (2.5 hours)

**Step 5: Git Setup (1 hour)**

1. Create `.gitignore` file in project root:
   ```bash
   cd /Users/[your-username]/Documents/grain/GrainApp
   touch .gitignore
   ```

2. Add to `.gitignore`:
   ```
   # Xcode
   xcuserdata/
   *.xcuserstate
   *.xcworkspace/xcuserdata/
   
   # macOS
   .DS_Store
   
   # Swift
   *.swiftpm
   .build/
   
   # CocoaPods (not using, but just in case)
   Pods/
   
   # Fastlane (not using, but just in case)
   fastlane/report.xml
   fastlane/Preview.html
   fastlane/screenshots
   fastlane/test_output
   ```

3. Initial commit:
   ```bash
   git add .
   git commit -m "feat: initial project setup with SwiftData"
   ```

4. Create GitHub repository:
   - Go to https://github.com/new
   - Repository name: `grain-app`
   - Description: "Grain - Privacy-first photo diary for iOS"
   - Private (recommended for now, can make public later)
   - Don't initialize with README (we already have a Git repo)
   - Create repository

5. Push to GitHub:
   ```bash
   git remote add origin https://github.com/[your-username]/grain-app.git
   git branch -M main
   git push -u origin main
   ```

**Step 6: README.md (1 hour)**

Create `README.md` in project root:

```markdown
# Grain

A privacy-first photo diary for iPhone.

## About

Grain is a simple daily photo diary app. Take one photo per day with optional notes to document your life. All data stays local on your device.

## Tech Stack

- SwiftUI
- SwiftData (iOS 17+)
- MVVM + Repository pattern
- Local storage (HEIC format)

## Development

### Requirements

- Xcode 15+
- iOS 17.0+
- macOS Sonoma or later

### How to Run

1. Clone the repository
2. Open `Grain.xcodeproj` in Xcode
3. Select an iPhone simulator (iOS 17+)
4. Press Cmd+R to run

### Project Structure

- `App/` - App entry point
- `Models/` - SwiftData models
- `Views/` - SwiftUI views
- `ViewModels/` - View models (MVVM)
- `Services/` - Services (photo capture, storage, etc.)
- `Repositories/` - Data layer (repository pattern)
- `UseCases/` - Business logic

## Roadmap

- v1.0: Photo diary (current development)
- v1.1: Gamification, widgets
- v1.2: Soft nudges, reminders
- v1.5+: Advanced features

## License

[To be determined]

## Contact

[Your email or Twitter]
```

Commit:
```bash
git add README.md
git commit -m "docs: add README with project overview"
git push
```

**Step 7: Plan Tomorrow (30 min)**

Review Week 1 checklist (see `WEEKLY_CHECKLIST.md`):
- [x] Monday tasks complete
- [ ] Tuesday: SwiftData model design

---

## Day 2: Tuesday - SwiftData Model

**Goal:** Design and implement SwiftData model, repository pattern

### Morning (2.5 hours)

**Step 1: Create DiaryEntry Model (1.5 hours)**

1. Create new file: `Models/DiaryEntry.swift`

```swift
import SwiftData
import Foundation

@Model
final class DiaryEntry {
    @Attribute(.unique) var id: UUID
    var date: Date // Normalized to midnight for "one per day" logic
    var photoFileName: String // e.g., "123e4567-e89b.heic"
    var noteText: String? // Optional text note
    var createdAt: Date
    var updatedAt: Date?
    
    init(
        id: UUID = UUID(),
        date: Date,
        photoFileName: String,
        noteText: String? = nil
    ) {
        self.id = id
        self.date = date.normalized() // Normalize to midnight
        self.photoFileName = photoFileName
        self.noteText = noteText
        self.createdAt = Date()
        self.updatedAt = nil
    }
}

// MARK: - Date Extension
extension Date {
    /// Normalizes date to midnight (start of day) in user's current timezone
    func normalized() -> Date {
        Calendar.current.startOfDay(for: self)
    }
}
```

2. Test the model (create a test file): `GrainTests/Models/DiaryEntryTests.swift`

```swift
import XCTest
@testable import Grain

final class DiaryEntryTests: XCTestCase {
    func testEntryCreation() {
        // Given
        let date = Date()
        let photoFileName = "test.heic"
        let noteText = "Test note"
        
        // When
        let entry = DiaryEntry(
            date: date,
            photoFileName: photoFileName,
            noteText: noteText
        )
        
        // Then
        XCTAssertNotNil(entry.id)
        XCTAssertEqual(entry.date, date.normalized())
        XCTAssertEqual(entry.photoFileName, photoFileName)
        XCTAssertEqual(entry.noteText, noteText)
        XCTAssertNotNil(entry.createdAt)
        XCTAssertNil(entry.updatedAt)
    }
    
    func testDateNormalization() {
        // Given
        let dateWithTime = Date() // e.g., 2024-02-08 14:35:22
        
        // When
        let entry = DiaryEntry(
            date: dateWithTime,
            photoFileName: "test.heic"
        )
        
        // Then
        let calendar = Calendar.current
        let components = calendar.dateComponents([.hour, .minute, .second], from: entry.date)
        XCTAssertEqual(components.hour, 0)
        XCTAssertEqual(components.minute, 0)
        XCTAssertEqual(components.second, 0)
    }
}
```

3. Run tests: Cmd+U (all tests should pass)

**Step 2: Create Repository Protocol (1 hour)**

1. Create new file: `Repositories/DiaryRepository.swift`

```swift
import Foundation
import UIKit

protocol DiaryRepository {
    func createEntry(photo: UIImage, note: String?, date: Date) async throws -> DiaryEntry
    func getAllEntries() async throws -> [DiaryEntry]
    func getEntry(id: UUID) async throws -> DiaryEntry?
    func getEntry(for date: Date) async throws -> DiaryEntry?
    func updateEntry(id: UUID, noteText: String) async throws
    func deleteEntry(id: UUID) async throws
}

// MARK: - Errors
enum DiaryError: LocalizedError {
    case entryAlreadyExists(date: Date)
    case entryNotFound
    case invalidPhoto
    case storageError(Error)
    
    var errorDescription: String? {
        switch self {
        case .entryAlreadyExists(let date):
            return "An entry already exists for \(date.formatted(date: .abbreviated, time: .omitted))"
        case .entryNotFound:
            return "Entry not found"
        case .invalidPhoto:
            return "Invalid photo"
        case .storageError(let error):
            return "Storage error: \(error.localizedDescription)"
        }
    }
}
```

---

### Afternoon (2.5 hours)

**Step 3: Implement SwiftDataDiaryRepository (2 hours)**

1. Create new file: `Repositories/SwiftDataDiaryRepository.swift`

```swift
import Foundation
import SwiftData
import UIKit

final class SwiftDataDiaryRepository: DiaryRepository {
    private let modelContext: ModelContext
    
    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }
    
    func createEntry(photo: UIImage, note: String?, date: Date) async throws -> DiaryEntry {
        // Check if entry already exists for this date
        if let existing = try await getEntry(for: date) {
            throw DiaryError.entryAlreadyExists(date: date)
        }
        
        // TODO: Save photo to disk (will implement tomorrow with PhotoStorageService)
        let photoFileName = "\(UUID().uuidString).heic"
        
        // Create entry
        let entry = DiaryEntry(
            date: date,
            photoFileName: photoFileName,
            noteText: note
        )
        
        modelContext.insert(entry)
        try modelContext.save()
        
        return entry
    }
    
    func getAllEntries() async throws -> [DiaryEntry] {
        let descriptor = FetchDescriptor<DiaryEntry>(
            sortBy: [SortDescriptor(\.date, order: .reverse)]
        )
        return try modelContext.fetch(descriptor)
    }
    
    func getEntry(id: UUID) async throws -> DiaryEntry? {
        let predicate = #Predicate<DiaryEntry> { entry in
            entry.id == id
        }
        let descriptor = FetchDescriptor<DiaryEntry>(predicate: predicate)
        return try modelContext.fetch(descriptor).first
    }
    
    func getEntry(for date: Date) async throws -> DiaryEntry? {
        let normalizedDate = date.normalized()
        let predicate = #Predicate<DiaryEntry> { entry in
            entry.date == normalizedDate
        }
        let descriptor = FetchDescriptor<DiaryEntry>(predicate: predicate)
        return try modelContext.fetch(descriptor).first
    }
    
    func updateEntry(id: UUID, noteText: String) async throws {
        guard let entry = try await getEntry(id: id) else {
            throw DiaryError.entryNotFound
        }
        
        entry.noteText = noteText
        entry.updatedAt = Date()
        try modelContext.save()
    }
    
    func deleteEntry(id: UUID) async throws {
        guard let entry = try await getEntry(id: id) else {
            throw DiaryError.entryNotFound
        }
        
        // TODO: Delete photo from disk (will implement with PhotoStorageService)
        
        modelContext.delete(entry)
        try modelContext.save()
    }
}
```

2. Update `GrainApp.swift` to set up SwiftData:

```swift
import SwiftUI
import SwiftData

@main
struct GrainApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            DiaryEntry.self,
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(sharedModelContainer)
    }
}
```

**Step 4: Test Repository (30 min)**

1. Create test file: `GrainTests/Repositories/DiaryRepositoryTests.swift`

```swift
import XCTest
import SwiftData
@testable import Grain

final class DiaryRepositoryTests: XCTestCase {
    var sut: SwiftDataDiaryRepository!
    var modelContext: ModelContext!
    
    override func setUp() async throws {
        try await super.setUp()
        
        // Create in-memory ModelContext for testing
        let schema = Schema([DiaryEntry.self])
        let config = ModelConfiguration(schema: schema, isStoredInMemoryOnly: true)
        let container = try ModelContainer(for: schema, configurations: [config])
        modelContext = ModelContext(container)
        
        sut = SwiftDataDiaryRepository(modelContext: modelContext)
    }
    
    func testGetAllEntries_WhenEmpty_ReturnsEmptyArray() async throws {
        // When
        let entries = try await sut.getAllEntries()
        
        // Then
        XCTAssertTrue(entries.isEmpty)
    }
    
    // Add more tests...
}
```

2. Run tests: Cmd+U

**Step 5: Commit Progress (10 min)**

```bash
git add .
git commit -m "feat: add SwiftData model and repository pattern"
git push
```

---

## End of Day 1-2

You've completed:
- ✅ Xcode project created
- ✅ Project structure set up
- ✅ Git repository initialized
- ✅ SwiftData model designed
- ✅ Repository pattern implemented
- ✅ Basic tests written

**Next up:** Day 3 (Wednesday) - Photo capture service!

---

## Pro Tips

1. **Take Breaks:** Use Pomodoro (25 min work, 5 min break)
2. **Test on Device Early:** Even without full features, test basic UI on real iPhone
3. **Commit Often:** Small, frequent commits are better than large, infrequent ones
4. **Don't Over-Engineer:** Keep it simple for v1.0, you can refactor later
5. **Ask for Help:** If stuck > 30 min, search Stack Overflow or ask on Twitter

---

## Troubleshooting

**Problem: "No such module 'SwiftData'"**
- Solution: Ensure iOS Deployment Target is 17.0+ (SwiftData requires iOS 17)

**Problem: Signing error "Failed to register bundle identifier"**
- Solution: Change bundle identifier to something unique (e.g., `com.yourname.GrainApp`)

**Problem: Simulator not showing iPhone 15 Pro**
- Solution: Xcode → Settings → Platforms → iOS → Download iOS 17.5 runtime

**Problem: Git push fails with authentication error**
- Solution: Use GitHub Personal Access Token instead of password
  - GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token
  - Use token as password when pushing

---

**You've got this! Let's build Grain! 🌾**
