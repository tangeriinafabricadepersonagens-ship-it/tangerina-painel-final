export default function CardMetric({ label, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col items-center justify-center">
      <span className="text-3xl font-bold text-orange-600">{value}</span>
      <span className="text-gray-700">{label}</span>
    </div>
  );
}
