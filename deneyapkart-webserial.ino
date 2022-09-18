void setup() {
  pinMode(A0, INPUT);
  pinMode(A1, INPUT);
  pinMode(D12, INPUT_PULLUP);
  Serial.begin(9600);
}

int x, y, btn;
String data;

void loop() {
  x = analogRead(A0);
  y = analogRead(A1);
  btn = digitalRead(D12);
  data = "{\"x\": " + String(x) + ", \"y\": " + String(y) + ", \"button\": " + !btn + "}"; // generate json from inputs
  Serial.println(data);
  delay(100);
}
