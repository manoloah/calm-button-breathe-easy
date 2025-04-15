
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#132737] border-r-[#1f3749] w-[300px]">
        <NavigationMenu className="flex flex-col gap-4 mt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/profile")}
          >
            Perfil
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/breathwork")}
          >
            Calma
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/bolt")}
          >
            Mídete
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 mt-auto"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;
