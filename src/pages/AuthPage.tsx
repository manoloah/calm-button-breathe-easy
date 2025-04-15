
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: isSignUp ? "¡Cuenta creada!" : "¡Bienvenido de nuevo!",
        description: isSignUp 
          ? "Por favor, revisa tu correo electrónico para verificar tu cuenta."
          : "Has iniciado sesión exitosamente.",
      });

      if (!isSignUp) navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#132737] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-unbounded text-white">
            {isSignUp ? 'Crear Cuenta' : 'Bienvenido de Nuevo'}
          </h2>
          <p className="mt-2 text-sm text-[#B0B0B0]">
            {isSignUp 
              ? 'Regístrate para comenzar a manejar tu ansiedad'
              : 'Inicia sesión para continuar tu viaje'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00B383] hover:bg-[#00956D] text-white"
          >
            {isLoading ? (
              "Cargando..."
            ) : isSignUp ? (
              "Registrarse"
            ) : (
              "Iniciar Sesión"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#B0B0B0] hover:text-white text-sm"
            >
              {isSignUp
                ? "¿Ya tienes una cuenta? Inicia sesión"
                : "¿Necesitas una cuenta? Regístrate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
