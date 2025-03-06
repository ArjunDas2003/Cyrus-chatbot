from django.db import models

# Create your models here.
class ChatMessage(models.Model):
    user_input = models.TextField()
    bot_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User: {self.user_input[:50]} - Bot: {self.bot_response[:50]}"
