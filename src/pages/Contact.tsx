import { GraduationCap, Calendar, Mail, User } from 'lucide-react';

export default function Contact() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
            Kontakt
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Schule
              </h3>
              <p className="text-gray-600">
                BBS Cora Berliner Schule, Hannover
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Projektverantwortliche
              </h3>
              <p className="text-gray-600">
                Vusala Mustafayeva
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                E-Mail
              </h3>
              <p className="text-gray-600">
                vusala.mustafayeva@my.com
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Projektzeitraum
              </h3>
              <p className="text-gray-600">
                Schuljahr 2025/2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
