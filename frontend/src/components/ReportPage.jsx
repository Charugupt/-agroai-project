import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ReportPage = ({ data, onBack }) => {
    if (!data) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to History
            </button>

            <div className="grid md:grid-cols-2 gap-10">

                {/* Image */}
                <div>
                    <img
                        src={data.image}
                        alt="Leaf"
                        className="rounded-2xl shadow-xl w-full"
                    />
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white">{data.disease}</h2>

                    <p className="text-brand-green font-semibold">
                        Confidence: {data.confidence}%
                    </p>

                    <div>
                        <h3 className="font-bold text-lg mb-2">🧪 Diagnosis</h3>
                        <p className="text-slate-400">{data.diagnosis}</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">💊 Treatment</h3>
                        <p className="text-slate-400">{data.treatment}</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">🌱 Prevention</h3>
                        <p className="text-slate-400">{data.prevention}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportPage;