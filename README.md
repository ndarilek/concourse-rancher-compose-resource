# Concourse Rancher-compose Resource

*NOTE*: It's probably not best to use this in production right now. It occasionally does stupid things like output command lines containing credentials to logs, because spitting out such data in private builds on real hobby projects is the best way for me to debug. I'll remove this blurb when this is no longer an issue, hopefully soon.

Performs [Rancher](https://rancher.com) deployments using [Rancher-compose](https://github.com/rancher/rancher-compose).

## Resource Configuration

```yaml
resource_types:

- name: rancher-compose
  type: docker-image
  source:
    repository: nolan/concourse-rancher-compose-resource
```

## Source Configuration

* `url`: *Required.* The URL of the Rancher endpoint.

* `access_key`: *Required.* A Rancher access key for the project's environment.

* `secret_key`: *Required.* A Rancher secret key for the project's environment.

### Example

```yaml
resources:
- name: compose
  type: rancher-compose
  source:
    url: {{rancher_url}}
    access_key: {{rancher_access_key}}
    secret_key: {{rancher_secret_key}}
```

## Behavior

### `check`: Not Yet Implemented

In the future, this may monitor Rancher projects for changes, but for the moment it is a no-op.

### `in`: Not Yet Implemented

In the future this might pull containers or something, but I'm not sure what it might meaningfully do now.

### `out`: Deploy a Rancher Project

Deploys a specified Rancher project, optionally pulling new containers, as well as starting/confirming/rolling back upgrades.

#### Parameters

* `path`: *Required.* Path to `docker-compose.yml`/`rancher-compose.yml` files.

* `project`: *Required.* The name of the rancher-compose project.

* `service`: *Optional.* Name of service to affect. If not specified, all services are affected.

* `pull`: *Optional.* If set, the project image is always pulled before a deployment.

* `upgrade`: *Optional.* One of `true`, `force`, `confirm` or `rollback`. Starts, forces, confirms or rolls back an upgrade.

* `environment`: *Optional.* A set of `<key>: <value>` YAML-formatted environment variable pairs that will be set in the rancher-compose shell. See [this documentation](http://docs.rancher.com/rancher/rancher-compose/environment-interpolation/) for information on using these environment variables in your docker-compose/rancher-compose.yml files.

* `file`: *Optional.* Specify a non-standard filename for the dockerfile

* `rancher_file`: *Optional.* Specify a non-standard filename for the rancherfile

#### Examples

Deploys upgrades to the `blog` service. In this instance, upgrades are automatically forced and confirmed, though it would be simple to break upgrade confirmation out into a separate job, add a rollback job and manually trigger each when the upgrade has been independently verified.

```yaml
jobs:
- name: blog
  plan:
  - get: blogRepo
    trigger: true
  - put: blogImage
    params:
      build: blogRepo
  - put: compose
    params:
      path: blogRepo
      project: app
      service: blog
      pull: true
      upgrade: force
      file: Dockerfile-alternate
  - put: compose
    params:
      path: blogRepo
      service: blog
      upgrade: confirm```
```
