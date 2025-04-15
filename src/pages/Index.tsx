
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-panic-background p-4">
      <h1 className="text-4xl font-unbounded text-panic-text-primary mb-12">
        PanicButton
      </h1>
      <PanicButton />
      <p className="mt-12 font-cabin text-panic-text-secondary text-center max-w-sm">
        Cuando sientas ansiedad, presiona el botón para iniciar un ejercicio de respiración guiada de 3 minutos.
      </p>
    </div>
  );
};

export default Index;
