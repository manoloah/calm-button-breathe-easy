
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/use-profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, User, Loader2 } from 'lucide-react';
import { Settings } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface Profile {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({
    username: null,
    first_name: null,
    last_name: null,
    date_of_birth: null,
    avatar_url: null
  });
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [date, setDate] = useState<Date>();
  const { isLoading, updateProfile, updateEmail, updatePassword, uploadAvatar } = useProfile();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile({
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth,
            avatar_url: data.avatar_url
          });
          
          if (data.date_of_birth) {
            setDate(new Date(data.date_of_birth));
          }
        }
        setEmail(user.email || '');
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    await updateProfile({
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      date_of_birth: date?.toISOString().split('T')[0],
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#132737] text-white p-4">
      <div className="flex justify-end p-4">
        <Button variant="ghost" className="text-white hover:bg-white/10">
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="max-w-2xl mx-auto mt-16 space-y-8">
        <h1 className="text-3xl font-unbounded mb-8">Tu Perfil</h1>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="relative">
              Cambiar Avatar
              <input
                type="file"
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#B0B0B0]">Nombre</label>
                <Input
                  value={profile.first_name || ''}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#B0B0B0]">Apellido</label>
                <Input
                  value={profile.last_name || ''}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="bg-white/10 border-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#B0B0B0]">Nombre de Usuario</label>
              <Input
                value={profile.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="bg-white/10 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#B0B0B0]">Fecha de Nacimiento</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-white/10 border-white/20 ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#00B383] hover:bg-[#00956D]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </form>

          <div className="space-y-4 pt-4 border-t border-white/20">
            <h2 className="text-xl font-unbounded">Configuración de la Cuenta</h2>
            
            <div className="space-y-2">
              <label className="text-sm text-[#B0B0B0]">Email</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20"
                />
                <Button 
                  onClick={() => updateEmail(email)}
                  disabled={isLoading}
                  variant="outline"
                  className="border-white/20"
                >
                  Actualizar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#B0B0B0]">Nueva Contraseña</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/10 border-white/20"
                />
                <Button 
                  onClick={() => {
                    updatePassword(newPassword);
                    setNewPassword('');
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="border-white/20"
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pb-20">
        {/* Extra space for the bottom navigation */}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
