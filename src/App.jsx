import Builder from './components/Builder';

function App() {
  return (
    <div class="h-full bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800" dir="rtl">
      <div class="max-w-6xl mx-auto h-full">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600">تطبيق جديد</h1>
        </div>
        <Builder />
      </div>
    </div>
  );
}

export default App;