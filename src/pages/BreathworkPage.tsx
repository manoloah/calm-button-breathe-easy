
import BreathingGuide from "@/components/BreathingGuide";
import BackButton from "@/components/BackButton";

const BreathworkPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-panic-softBlue p-4 relative">
      <BackButton />
      <BreathingGuide />
    </div>
  );
};

export default BreathworkPage;
