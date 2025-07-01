provider "aws" {
  region = "us-east-1" //region you want to init the server on
}
resource "aws_instance" "first_Instance" {
  ami = "ami-020cba7c55df1f615"   //for using ubuntu server
  instance_type = "t2.micro"
  subnet_id = "your-subnet-id"
  key_name = "your-keypair"
}