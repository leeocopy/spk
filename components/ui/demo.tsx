"use client"

import FlashlightTextReveal from "./flashlight-text-reveal"

// Move the pointer to shine the light. Leave it and the light searches alone.
export default function Demo() {
  return (
    <div style={{ width: "100%" }}>
      <FlashlightTextReveal
        text={"ENGLISH\nHAPPENS!"}
        textColor="#ffffff"
        fontFamily={'"Garet", "Garet Heavy", Arial, sans-serif'}
        colors={["#000000", "#313130", "#C3C3C2"]}
      />
    </div>
  )
}
