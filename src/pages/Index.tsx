
import PanicButton from "@/components/PanicButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-panic-softBlue p-4">
      <h1 className="text-3xl font-bold mb-12 text-panic-dark">PanicButton</h1>
      <PanicButton />
      <p className="mt-12 text-panic-dark text-center max-w-sm">
        Cuando sientas ansiedad, presiona el botón para iniciar un ejercicio de respiración guiada de 3 minutos.
      </p>
    </div>
  );
};

export default Index;
