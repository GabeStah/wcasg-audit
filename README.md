
Audit is a backend service that performs accessibility audits for requested URLs.  Audit is essentially just a slightly-modified fork of the [pa11y WebService](https://github.com/pa11y/pa11y-webservice) app with a local MongoDB instance to store requests and results.

## Usage

### Creating a Task

An new audit task can be created by sending a `POST` request to the `/tasks` endpoint with the appropriate attributes:

```
$ curl --location --request POST 'https://audit.widget.wcasg.solarix.dev/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "audit-12345",
    "url": "example.com",
    "standard": "WCAG2AA"
}'
```

This generates an new `task` document in MongoDB:

```json
{
  "_id": {
    "$oid": "5eb391d90cafdb66534da68e"
  },
  "name": "audit-12345",
  "url": "example.com",
  "standard": "WCAG2AA",
  "headers": null
}
```

However, this task must be explicitly executed to perform any further actions.

### Execute a Task

Sending a `POST` request to `/tasks/{id}/run` will execute the task in question:

```
curl --location --request POST 'https://audit.widget.wcasg.solarix.dev/tasks/5eb391d90cafdb66534da68e/run'
```

If this returns a `202` response code then the task is being executed.

### Retrieve Task Results

Upon completion a new `results` record is created in MongoDB.  Send a `GET` request to `/tasks/{id}/results?full=true` to retrieve this document:

```
curl --location --request GET 'https://audit.widget.wcasg.solarix.dev/tasks/5eb391d90cafdb66534da68e/results?full=true'
```

```json
{
  "_id": {
    "$oid": "5eb3569f0cafdb66534da68d"
  },
  "count": {
    "total": {
      "$numberInt": "62"
    },
    "error": {
      "$numberInt": "3"
    },
    "warning": {
      "$numberInt": "5"
    },
    "notice": {
      "$numberInt": "54"
    }
  },
  "results": [
    {
      "code": "WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.2",
      "type": "notice",
      "typeCode": {
        "$numberInt": "3"
      },
      "message": "Check that the title element describes the document.",
      "context": "<title>Example.com</title>",
      "selector": "html > head > title",
      "runner": "htmlcs",
      "runnerExtras": {}
    },
    {
      "code": "WCAG2AA.Principle3.Guideline3_2.3_2_4.G197",
      "type": "notice",
      "typeCode": {
        "$numberInt": "3"
      },
      "message": "Check that components that have the same functionality within this Web page are identified consistently in the set of Web pages to which it belongs.",
      "context": null,
      "selector": "",
      "runner": "htmlcs",
      "runnerExtras": {}
    }
    ...
  ],
  "task_id": "5eb391d90cafdb66534da68e",
  "ignore": [],
  "date": {
    "$numberDouble": "1588811423413"
  }
}
```

## Infrastructure

The Audit app and the WCASG Connector apps share environment-specific deployment servers, along with their associated MongoDB service.

### Testing Environment

- SRN: `srn:ec2:wcasg:widget:audit-connector:testing::instance`
- Endpoint: `audit.widget.wcasg.solarix.dev`

### Production Environment

- SRN: `srn:ec2:wcasg:widget:audit-connector:production::instance`
- Endpoint (Solarix): `audit.widget.wcasg.solarix.host`
- Endpoint (Client): `audit.wcasg.com`

### Accessing MongoDB

To directly connect:

1. Open AWS console and adjust `srn:vpc:wcasg:widget:connector::sg/instance` security group.
2. Add an `inbound rule` allowing `TCP 27017` from your private IP address.
3. Now connect to server's mongodb port: 
  - Testing: `mongodb://audit.widget.wcasg.solarix.dev:27017/pa11y-webservice-testing`
  - Production: `mongodb://audit.widget.wcasg.solarix.host:27017/pa11y-webservice-production`

To connect via SSH tunnel:

1. Make sure you have a local copy of the `srn:ec2:solarix:core::pem/dev` SSH key.
2. Establish a tunnelled connection:
  - Testing: `ssh -L 4321:localhost:27017 ubuntu@audit.widget.wcasg.solarix.dev -f -N -i ~/.ssh/path/to/solarix__pem_dev.pem`
  - Production: `ssh -L 4321:localhost:27017 ubuntu@audit.widget.wcasg.solarix.host -f -N -i ~/.ssh/path/to/solarix__pem_dev.pem`
3. Localhost port `4321` can now access MongoDB: `mongo --port 4321`

## Deployment

1. Make changes and push to new feature branch or `testing` branch.
2. Updates to `testing` branch execute GitLab CI/CD and will deploy changes to testing (`srn:ec2:wcasg:widget:audit-connector:testing::instance`).
3. Verify testing environment.
4. If stable, generate merge request into `production` environment.
5. Upon merge, GitLab CI/CD will deploy to production (`srn:ec2:wcasg:widget:audit-connector:production::instance`).
