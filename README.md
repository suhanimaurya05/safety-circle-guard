# Safe Haven

Create a modern, professional, trustworthy *Women Safety Web Application* with a strong focus on emergency assistance, simplicity, accessibility, and fast interaction.

The application should feel like a real-world safety product, not a generic dashboard. The UI must be clean, responsive, intuitive, and usable under stressful situations.

## 1. Overall Design Direction

Design style:

* Modern, minimal, premium and trustworthy

* Mobile-first responsive design

* Clean cards with subtle shadows

* Rounded corners, but avoid excessive "cute" styling

* Strong visual hierarchy

* Large touch-friendly buttons

* Clear typography and readable text

* Accessible contrast

* Use smooth but subtle animations

* Avoid unnecessary gradients, excessive glassmorphism, or clutter

Color palette:

* Primary: deep purple / indigo

* Emergency/SOS: strong red

* Success/Safe: green

* Warning: amber

* Background: very light neutral

* Text: dark charcoal

The application should communicate:

*Safety + Trust + Speed + Simplicity*

Use icons consistently throughout the application.

---

# 2. Authentication

Create:

### Login Page

* Email / phone number

* Password

* Show/hide password

* Remember me

* Forgot password

* Login button

* Link to Sign Up

### Sign Up Page

* Full name

* Email

* Phone number

* Password

* Confirm password

* Emergency contact setup

* Terms & privacy checkbox

* Create account button

### Onboarding

After registration, show a short onboarding flow explaining:

1. How SOS works

2. How emergency contacts work

3. How live location sharing works

Keep onboarding short and visual.

---

# 3. Main Dashboard

The dashboard is the most important screen.

Create a highly intuitive safety dashboard containing:

### Header

* App logo/name

* User profile

* Notification icon

* Settings icon

### Main SOS Section

Place a *large, visually dominant SOS button* near the center of the screen.

Text:

"Emergency SOS"

Supporting text:

"Press and hold for 3 seconds"

Do NOT trigger SOS on a simple accidental tap.

When the user presses and holds:

* Show a circular progress indicator

* Clearly communicate that SOS is being activated

* Provide a cancel option before activation

After activation, show an emergency state with:

* SOS Activated

* Current location

* Emergency contacts being notified

* Live location sharing status

* Call emergency services option

* Cancel/End SOS option

Use red only where necessary so the emergency state feels serious and distinct.

---

# 4. Emergency Contacts

Create a dedicated Emergency Contacts page.

Features:

* Add emergency contact

* Edit contact

* Delete contact

* Contact name

* Phone number

* Relationship

* Primary emergency contact indicator

Display contacts as clean cards.

Each card should have:

* Name

* Relationship

* Phone number

* Call button

* Edit button

Also allow users to choose which contacts receive SOS alerts.

Include a clear explanation:

"Your selected emergency contacts can be notified when you activate SOS."

---

# 5. Live Location Sharing

Create a Live Location page.

Display:

* Interactive map

* Current location marker

* Location accuracy indicator

* Sharing status

* Duration of location sharing

* Selected emergency contacts receiving location

Controls:

* Start sharing

* Stop sharing

* Share with emergency contacts

When location sharing is active, clearly show:

"Live location sharing is active."

Include a visible safety status indicator.

Use a realistic map-style UI placeholder if an actual map API is not configured.

---

# 6. Nearby Help

Create a "Nearby Help" page.

Show nearby:

* Police stations

* Hospitals

* Emergency services

Use an interactive map and list view.

Each location card should contain:

* Name

* Distance

* Address

* Call button

* Directions button

Add filters:

* Police

* Hospitals

* Emergency Services

Make the most important action (Call / Directions) immediately accessible.

---

# 7. Fake Call Feature

Create a dedicated "Fake Call" feature.

Purpose:

Allow the user to simulate an incoming call when they feel uncomfortable in a situation.

UI:

* Fake Call button

* Select caller name

* Select delay

* Start fake call

Example caller names:

* Mom

* Dad

* Friend

* Custom

After activation, display a realistic incoming-call screen with:

* Caller name

* Call interface

* Answer / Decline buttons

Keep this feature clearly separated from the real emergency SOS functionality.

---

# 8. Safe Route / Map

Create a "Safe Route" page.

The user should be able to:

* Enter starting location

* Enter destination

* View route on map

* See alternative routes

Prioritize routes using safety-oriented indicators where data is available.

Show route information such as:

* Distance

* Estimated time

* Safety indicators

Use visual route highlighting.

Include a disclaimer that route safety information depends on available data and should not be treated as a guarantee of safety.

---

# 9. Incident Reporting

Create an "Report Incident" page.

Allow users to report a safety incident.

Fields:

* Incident type

* Date/time

* Location

* Description

* Optional image/file attachment

* Submit report

Possible incident categories:

* Harassment

* Suspicious activity

* Unsafe area

* Stalking

* Other

After submission:

Show a confirmation screen with:

"Your report has been submitted."

Do not expose sensitive report information publicly.

---

# 10. Navigation

Use a simple navigation system.

For desktop:

* Sidebar navigation

Navigation items:

* Dashboard

* SOS

* Emergency Contacts

* Live Location

* Nearby Help

* Safe Route

* Fake Call

* Report Incident

* Settings

For mobile:

Use a bottom navigation bar for the most important sections.

Keep SOS easily accessible from every major screen.

---

# 11. Settings

Create a Settings page containing:

* Profile

* Emergency contacts

* Location permissions

* Notification preferences

* Privacy settings

* Security

* Help & Support

* Logout

Include clear privacy explanations for location sharing.

---

# 12. Important UX States

Design all important states, not just the normal screens.

Include:

### Normal state

User is safe.

Display:

"You're Safe"

### SOS activation

Show confirmation/progress before triggering.

### SOS active

Show:

"SOS Active"

Display:

* Location sharing status

* Emergency contacts notified

* Emergency options

### Location disabled

Explain why location permission is needed and provide a way to enable it.

### No emergency contacts

Prompt the user to add contacts.

### No nearby services

Show an appropriate empty state.

### Network unavailable

Show a clear offline/error state.

### Form validation

Use friendly inline validation messages.

---

# 13. Responsive Design

The application must work properly on:

* Mobile phones

* Tablets

* Desktop

* Large screens

Prioritize mobile usability because this is a safety application.

Buttons should be large enough to tap easily.

Important emergency actions should never be hidden inside menus.

---

# 14. Accessibility

Follow accessibility best practices:

* High color contrast

* Large readable text

* Clear labels

* Keyboard accessibility

* Visible focus states

* Avoid relying only on color to communicate status

* Touch-friendly controls

* Clear error messages

---

# 15. Micro-interactions

Use subtle animations for:

* SOS countdown

* Button press

* Page transitions

* Location sharing status

* Success confirmation

* Loading states

Animations should never delay emergency actions.

---

# 16. Important Product Rule

This is a *safety-focused application*.

Do not make the interface playful or overly decorative.

Prioritize:

1. Speed

2. Clarity

3. Reliability

4. Accessibility

5. Trust

The SOS action must always be visually prominent.

Do not add unnecessary features that are not specified above.

Do not use fake statistics, fake emergency numbers, or pretend that location/emergency services are actually connected if APIs are not configured.

Where backend/API functionality is unavailable, create realistic UI states and clearly structured placeholders so that real APIs can be integrated later.

Create a polished, production-quality UI/UX for the complete application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safety-circle-guard.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e8822f94-055d-4f5f-9b57-b819c71cf991).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
