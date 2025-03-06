from django.shortcuts import render
from django.http import JsonResponse
import google.generativeai as genai
from .models import ChatMessage

# Initialize Gemini API
genai.configure(api_key="AIzaSyCiG6kVBn6TPQC5uFUtNChY1O92eQpedX4")

def home(request):
    return render(request, "index.html")

def chat_with_cyrus(request):
    if request.method == "POST":
        user_input = request.POST.get("user_input", "")

        try:
            model = genai.GenerativeModel("gemini-1.5-pro-001")
            response = model.generate_content(user_input)
            bot_reply = response.text if response else "Sorry, I couldn't understand that."

            # Save to database
            ChatMessage.objects.create(user_input=user_input, bot_response=bot_reply)

        except Exception as e:
            bot_reply = "Error: " + str(e)

        return JsonResponse({"response": bot_reply})

    return render(request, "chat.html")
