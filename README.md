# Concourse Rancher-compose Resource

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

* `project`: *Required.* The name of the rancher-compose project.

* `access_key`: *Required.* A Rancher access key for the project's environment.

* `secret_key`: *Required.* A Rancher secret key for the project's environment.

### Example

```yaml
resources:
- name: compose
  type: rancher-compose
  source:
    project: my_rancher_project
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

* `service`: *Optional.* Name of service to affect. If not specified, all services are affected.

* `pull`: *Optional.* If set, the project image is always pulled before a deployment.

* `upgrade`: *Optional.* One of `true`, `force`, `confirm` or `rollback`. Starts, forces, confirms or rolls back an upgrade.

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
      service: blog
      pull: true
      upgrade: fource
  - put: compose
    params:
      path: blogRepo
      service: blog
      upgrade: confirm```
```
