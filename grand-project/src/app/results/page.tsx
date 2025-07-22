'use client';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
    const [data, setData] = useState<{ tailored_text: string; feedback: string } | null>(null);

    useEffect(() => {
        // Ideally you pass state via Router or fetch by ID
        async function load() {
            const res = await fetch('/api/last-resume'); // you’ll build this
            setData(await res.json());
        }
        load();
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Your Tailored Resume</h2>
            <pre className="p-4 bg-base-200 rounded mb-6 whitespace-pre-wrap">
                {data.tailored_text}
            </pre>
            <h3 className="text-xl font-medium mb-2">Feedback</h3>
            <p className="mb-6">{data.feedback}</p>
            <button className="btn btn-secondary mr-4">Download PDF</button>
            <a href="/history" className="btn btn-outline"></a>
        </div>
    )
}