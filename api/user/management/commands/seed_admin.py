from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Seed the database with an admin user if not exists"

    def handle(self, *args, **options):

        if not User.objects.filter(email="admin@email.com").exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@email.com",
                password="123456",
                role="admin"
            )
            self.stdout.write(self.style.SUCCESS(
                "✅ Admin user created successfully"))
        else:
            self.stdout.write(self.style.WARNING("⚠️ Admin user already exists"))
