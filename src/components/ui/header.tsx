import { Stethoscope } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center h-16">
          <Stethoscope className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">
            HealthAssist <span className="text-primary">AI</span>
          </h1>
        </div>
      </div>
    </header>
  );
}
