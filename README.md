
## Description / Pipeline

1.  User enters domain name into input field (On marketing website or Dashboard)
2.  Our software requests a scan from the API, API delivers us a report.
3.  We display the report (Client may choose to email report, so we just need to save the response to pull from various endpoints). 

### API (Pa11y)

- Well-maintained and open source.
- Supports both WCAG2A+ and Section508 standards.
- Audits can be performed either via command line or via a Node JS app.
- Support multiple [runners](https://github.com/pa11y/pa11y#runners) to execute and return different types of results.
- [Node-based Dashboard](https://github.com/pa11y/pa11y-dashboard)
- [CI tool](https://github.com/pa11y/pa11y-ci)
- [Node-based webservice app](https://github.com/pa11y/pa11y-webservice)

### Storage

- MongoDB as primary db.
- Redis as secondary db for WCASG Dashboard queue integration (MongoDB support seems spotty, at best).

> Client requests storage of this data so that we have some historical context to how a site does over time. Eventually, we will make historical data available to users in the backend dashboard so that they can maintain their accessibility via the application. 

### What to do with the data

> The idea behind the scan is to alert the user (site owner) to their accessibility issues. Eventually the app will provide a gateway to solve those issues by adding custom fixes to the custom input feature of the app (ie: add alt tag to this image, fix is injected into the site via the app connection). 

### Use Limits

> A config should be created so that we can limit the number of times a scan may happen to a site within a 24hr period. 

### Dashboard Features

> The goal of this to start (MVP) is to not reinvent the wheel by forcing us to make a dozen dashboard graphs and stats. If an API service fits the bill and provides a report that can be rebranded or easily thrown into a design framework to display it's data - that seems like a good half measure to avoid a bunch of grunt work. 

### MISC Things

- Ignore sub-directories, scan should do an entire domain each time and stay within that domain
- Scan a subdomain if requested, but do not deviate from that subdomain (treat it is an independent domain)
- Plan on the input / scan submit being placed on LAMP stack. 
- Create a new `WCASG Audit` Node.js API service, likely using the [pa11y WebService](https://github.com/pa11y/pa11y-webservice) app as a starter (and possibly adding [pa11y dashboard](https://github.com/pa11y/pa11y-dashboard) as well, though not required for our needs atm).
- The `WCASG Audit` app has [API endpoints](https://github.com/pa11y/pa11y-webservice/wiki/Web-Service-Endpoints) for requesting audit tasks and retrieving results.
- The webservice requires a MongoDB instance, so audit results will be stored there.
- Add some new logic to the Laravel WCASG Dashboard app so it can send and receive requests to the `WCASG Audit` API app.
  - The Dashboard db should track audit requests and (possibly) cache results obtained from the API.  It depends a bit on how verbose the results data is, but likely we'll just store the critical data to obtain the result on-demand (ID, domain, timestamp, etc) from the Audit API db.
- To support more frequent/randomized audits for things like marketing, in addition to `User`-requested audits, we can also implement something like [Laravel Envoy](https://laravel.com/docs/master/envoy) and [Laravel Queues](https://laravel.com/docs/master/queues) to perform asynchronous batch audit requests to the Audit API service.

## Implementation TODO

- [ ] Setup MongoDB as both `development` and `testing` database.
- [ ] Setup Node server.
- [ ] Install [pa11y WebService](https://github.com/pa11y/pa11y-webservice)
- [ ] Install [pa11y dashboard](https://github.com/pa11y/pa11y-dashboard)
- [ ] Add ability to request a scan by domain name
- [ ] Show results on a web page (unstyled or ugly is fine)
- [ ] Allow API to be posted against from any sort of Hubspot or webpage html form.
  - [ ] While this doesn't need to focus on security, privacy is a good metric to uphold here. Public URL results should probably expire unless connected to a user id in the dashboard, never expire in the DB so that eventually the admin can search historical results.
  - [ ] Add throttling mechanism.