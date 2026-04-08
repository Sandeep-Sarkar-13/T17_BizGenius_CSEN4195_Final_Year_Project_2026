import cv2
import os
import numpy as np
import statistics
from ultralytics import YOLO
from twilio.rest import Client


# Initialize Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

x_mouse = 0
y_mouse = 0

# Initialize YOLO model with custom weights
model = YOLO("final_jawaan_final_120.pt")

# Initialize video capture
vid = cv2.VideoCapture('test_video1.mp4')
height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
fps = vid.get(cv2.CAP_PROP_FPS)
out = cv2.VideoWriter("mytest_gray.mp4", cv2.VideoWriter_fourcc(*'MP4V'), fps, (width, height), isColor=False)
out2 = cv2.VideoWriter("mytest_RGB.mp4", cv2.VideoWriter_fourcc(*'MP4V'), fps, (width, height))

def send_sms_alert(frame_number):
    """Send an SMS alert for unauthorized detection."""
    try:
        message = f"ALERT: Unauthorized person detected in frame {frame_number}"
        response = twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=ALERT_PHONE_NUMBER
        )
        print(f"SMS Alert Sent: {message}, SID: {response.sid}")
    except Exception as e:
        print(f"Failed to send SMS: {e}")

def mouse_events(event, x, y, flags, param):
    """Track mouse movement."""
    global x_mouse, y_mouse
    if event == cv2.EVENT_MOUSEMOVE:
        x_mouse, y_mouse = x, y

# Dictionary to log counts
D1 = {}
num = 0
L2 = []  # Stores the count of Unauthorized in batches
L3 = []  # Stores the count of BSF in batches

while True:
    num += 1
    success, frame = vid.read()
    if not success:
        break

    frame_resized = cv2.resize(frame, (960, 540))
    
    # Object detection
    results = model.predict(frame_resized)
    result = results[0]
    
    bsf_count = 0
    unauthorized_count = 0

    # Process detected boxes
    for box in result.boxes:
        label = result.names[box.cls[0].item()]
        confidence = box.conf[0].item() * 100  # Confidence in percentage

        if label == 1:
            unauthorized_count += 1
            # Trigger SMS alert if confidence > 30%
            #if confidence > 30:
            send_sms_alert(num)
        elif label == "BSF":
            bsf_count += 1

    # Add counts to lists
    if num % 10 != 0:
        L2.append(unauthorized_count)
        L3.append(bsf_count)
    else:
        D1[num] = {"Unauthorized": max(L2), "BSF": max(L3)}
        L2 = []
        L3 = []

    # Temperature tracking
    gray8 = cv2.cvtColor(frame_resized, cv2.COLOR_RGB2GRAY)
    data = gray8[y_mouse, x_mouse]
    cv2.circle(gray8, (x_mouse, y_mouse), 2, (0, 0, 0), -1)
    cv2.putText(gray8, f"{data:.1f}", (x_mouse - 80, y_mouse - 15), cv2.FONT_HERSHEY_PLAIN, 3, (255, 0, 0), 5)

    result_temp = cv2.applyColorMap(gray8, cv2.COLORMAP_JET)
    result_temp2 = cv2.applyColorMap(gray8, cv2.COLORMAP_MAGMA)
    screen1 = np.concatenate((result_temp, frame_resized), axis=0)
    screen2 = np.concatenate((result.plot(), result_temp2), axis=0)
    screen = np.concatenate((screen1, screen2), axis=1)

    # Display counts
    cv2.imshow("Output", screen)
    out.write(gray8)
    out2.write(frame)

    cv2.setMouseCallback("Output", mouse_events)

    if cv2.waitKey(10) & 0xFF == ord("q"):
        break

# Release resources
vid.release()
out.release()
out2.release()
cv2.destroyAllWindows()

# Process results
unauthorized_counts = [v["Unauthorized"] for v in D1.values()]
bsf_counts = [v["BSF"] for v in D1.values()]
frames = list(D1.keys())
mean_unauthorized = statistics.mean(unauthorized_counts)

# Print results
print("Frame Stats:", D1)
print("Mean Unauthorized:", mean_unauthorized)
for frame, counts in D1.items():
    if counts["Unauthorized"] >= mean_unauthorized:
        print(f"Frame {frame}: Unauthorized count is high.")
    else:
        print(f"Frame {frame}: Unauthorized count is low.")
















