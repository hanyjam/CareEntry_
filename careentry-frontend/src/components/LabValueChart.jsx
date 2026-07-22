import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LabValueChart({ data, title, yAxisLabel }) {
  // Data-Format umwandeln für Recharts
  const chartData = data.map(item => ({
    datum: new Date(item.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
    wert: item.wert,
    normalbereich: item.normalbereich
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="datum" 
            style={{ fontSize: '12px' }}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            style={{ fontSize: '12px' }}
            stroke="#6b7280"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="wert" 
            stroke="#0ea5e9" 
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
            name="Messwert"
          />
        </LineChart>
      </ResponsiveContainer>

      {data[0]?.normalbereich && (
        <p className="text-sm text-gray-600 mt-3">
          Normalbereich: {data[0].normalbereich} {data[0].einheit}
        </p>
      )}
    </div>
  );
}

export default LabValueChart;