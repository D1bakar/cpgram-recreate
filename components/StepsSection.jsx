"use client";

import { FileText, Building2, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StepsSection() {
  const t = useTranslations("steps");

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {/* Step 1 */}
      <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <FileText className="w-8 h-8 text-blue-700" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {t("step1_title")}
        </h3>
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
          {t("step1_desc")}
        </p>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-blue-700" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {t("step2_title")}
        </h3>
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
          {t("step2_desc")}
        </p>
      </div>

      {/* Step 3 */}
      <div className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
        <div className="bg-green-50 p-4 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-700" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {t("step3_title")}
        </h3>
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
          {t("step3_desc")}
        </p>
      </div>
    </div>
  );
}