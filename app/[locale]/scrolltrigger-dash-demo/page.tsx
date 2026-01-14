import ScrollTriggerDash from "@/app/components/ScrollTriggerDash";

export default function ScrollTriggerDashDemoPage() {
  return (
    <div 
      className="min-h-screen font-['PP_Neue_Montreal']"
      style={{
        background: "linear-gradient(7deg, rgba(215, 176, 138, 1) 0%, rgba(37, 80, 156, 1) 100%)",
      }}
    >
      <ScrollTriggerDash />
    </div>
  );
}
