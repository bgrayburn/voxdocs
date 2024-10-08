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

resource "digitalocean_droplet" "voxdocs" {
  name   = "voxdocs-droplet"
  region = "nyc1"            # Choose the region closest to you
  size   = "s-1vcpu-1gb"      # Choose the Droplet size
  image  = "ubuntu-20-04-x64" # Choose the OS image

  ssh_keys = [var.ssh_fingerprint]
}

resource "digitalocean_reserved_ip" "voxdocs_ip" {
  region     = digitalocean_droplet.voxdocs.region
}

resource "digitalocean_reserved_ip_assignment" "voxdocs_ip_assignment" {
  ip_address = digitalocean_reserved_ip.voxdocs_ip.ip_address
  droplet_id = digitalocean_droplet.voxdocs.id
}

resource "digitalocean_project" "voxdocs" {
  name = "voxdocs"
  description = "A project to deploy voxdocs"
  purpose = "markdown editor with an openai interface"
  environment = "Development"
  resources = [digitalocean_droplet.voxdocs.urn]
}

variable "ssh_fingerprint" {
  description = "The fingerprint of your SSH key to access the Droplet"
  type        = string
}

