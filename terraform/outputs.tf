# outputs.tf

output "instance_ip" {
  value = aws_instance.app.public_ip
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_instance.app.public_ip}"
}

output "urls" {
  value = {
    frontend   = "http://${aws_instance.app.public_ip}:5173"
    backend    = "http://${aws_instance.app.public_ip}:3000"
    grafana    = "http://${aws_instance.app.public_ip}:3001"
    prometheus = "http://${aws_instance.app.public_ip}:9090"
  }
}
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app.id
}