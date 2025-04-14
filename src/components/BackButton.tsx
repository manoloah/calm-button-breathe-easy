
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  destination?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ destination = "/" }) => {
  const navigate = useNavigate();

  return (
    <button
      className="absolute top-6 left-6 p-2 rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition-all"
      onClick={() => navigate(destination)}
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6 text-panic-dark" />
    </button>
  );
};

export default BackButton;
