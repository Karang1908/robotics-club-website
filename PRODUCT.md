# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

User-confirmed: Next.js, React, and Node.js.

## Users

Students and visitors looking for the Robotics Club at BITS Pilani Dubai Campus, its lab areas, people, announcements, and a way to contact the club. Club staff maintain the site by editing one content file.

## Product Purpose

Introduce the club, feature robot categories from its lab facilities, publish new happenings, and make current club information easy to find with little scrolling on the homepage.

## Capabilities and Constraints

- Public homepage keeps the robot showcase in the center and news on the right at desktop size.
- Showcase changes automatically and can be controlled manually.
- Public navigation retains Home, Members, News, Lab Facilities, and Contact.
- Standalone static site: no database, server code or accounts. All content (text, navigation, news, members, facilities, contact details, accent colour) lives in `content/site.js`; pictures live in `public/images/`.
- Deploys to Vercel straight from GitHub; every push republishes.
- The contact form opens the visitor's email app addressed to the club, because nothing is stored by the site.

## Brand Commitments

Name: Robotics Club, BITS Pilani Dubai Campus. The user's sketch is the layout reference. The old website supplies route names and existing facility category descriptions, while its visual style is being replaced.

## Evidence on Hand

- Existing public site: `https://bits-robotics-club.vercel.app`
- User-provided hand-drawn layout sketch.
- The old site lists facility categories but uses TBA for news and member names. No verified announcements, member profiles, email, or actual lab photos were supplied.

## Product Principles

- Put the club, machines, and latest news within immediate view.
- Keep unverified content visibly provisional.
- Let club staff update content by editing a single, commented file.
