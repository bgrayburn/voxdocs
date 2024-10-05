terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.digitalocean_token
}

resource "digitalocean_droplet" "voxdocs_backend" {
  name   = "voxdocs-backend-droplet"
  region = "nyc1"            # Choose the region closest to you
  size   = "s-1vcpu-1gb"      # Choose the Droplet size
  image  = "ubuntu-20-04-x64" # Choose the OS image

  ssh_keys = [var.ssh_fingerprint]
}

resource "digitalocean_project" "voxdocs" {
  name = "voxdocs"
  description = "A project to deploy voxdocs"
  purpose = "markdown editor with an openai interface"
  environment = "Development"
  resources = [digitalocean_droplet.voxdocs_backend.urn]
}

variable "ssh_fingerprint" {
  description = "The fingerprint of your SSH key to access the Droplet"
  type        = string
}

