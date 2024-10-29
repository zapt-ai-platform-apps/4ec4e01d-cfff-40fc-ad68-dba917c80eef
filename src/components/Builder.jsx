import { createSignal, Show } from 'solid-js';
import { createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';

function Builder() {
  const [projectName, setProjectName] = createSignal('');
  const [projectDescription, setProjectDescription] = createSignal('');
  const [specifications, setSpecifications] = createSignal('');
  const [generatedCode, setGeneratedCode] = createSignal('');
  const [currentStep, setCurrentStep] = createSignal(1);
  const [loading, setLoading] = createSignal(false);
  const [generatedImage, setGeneratedImage] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [markdownContent, setMarkdownContent] = createSignal('');

  const handleNext = () => {
    if (currentStep() === 1 && projectName() && projectDescription()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep() > 1) {
      setCurrentStep(currentStep() - 1);
      setGeneratedCode('');
    }
  };

  const handleGenerateProject = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `قم بإنشاء كود كامل لمشروع ${projectDescription()} باسم "${projectName()}". المواصفات: ${specifications()}`,
        response_type: 'text'
      });
      setGeneratedCode(result);
    } catch (error) {
      console.error('Error generating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const result = await createEvent('generate_image', {
        prompt: `صورة توضيحية لمشروع باسم "${projectName()}" يتعلق بـ ${projectDescription()}`
      });
      setGeneratedImage(result);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: `اسم المشروع: ${projectName()}. الوصف: ${projectDescription()}. المواصفات: ${specifications()}`
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMarkdown = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `اكتب محتوى README.md مفصلًا لمشروع باسم "${projectName()}" يتعلق بـ ${projectDescription()}. قم بتضمين المواصفات التالية: ${specifications()}`,
        response_type: 'text'
      });
      setMarkdownContent(result);
    } catch (error) {
      console.error('Error generating markdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div class="h-full" dir="rtl">
      <Show when={currentStep() === 1}>
        <div class="space-y-4 text-right">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">إنشاء مشروع جديد</h2>
          <input
            type="text"
            placeholder="اسم المشروع"
            value={projectName()}
            onInput={(e) => setProjectName(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-right"
          />
          <input
            type="text"
            placeholder="وصف المشروع"
            value={projectDescription()}
            onInput={(e) => setProjectDescription(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border text-right"
          />
          <button
            class={`px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!(projectName() && projectDescription()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            disabled={!(projectName() && projectDescription())}
          >
            التالي
          </button>
        </div>
      </Show>

      <Show when={currentStep() === 2}>
        <div class="space-y-4 text-right">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">مواصفات المشروع</h2>
          <textarea
            placeholder="أدخل مواصفات مشروعك..."
            value={specifications()}
            onInput={(e) => setSpecifications(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border h-40 text-right"
          ></textarea>
          <div class="flex space-x-4 justify-end">
            <button
              class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleBack}
            >
              العودة
            </button>
            <button
              class={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() || !specifications() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateProject}
              disabled={loading() || !specifications()}
            >
              {loading() ? 'جاري التوليد...' : 'توليد المشروع'}
            </button>
          </div>
        </div>
      </Show>

      <Show when={generatedCode()}>
        <div class="mt-8 text-right">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">المشروع المُنشأ</h2>
          <pre class="bg-white p-4 rounded-lg shadow-md overflow-auto max-h-96 text-left">
            {generatedCode()}
          </pre>
          <div class="flex flex-wrap space-x-4 mt-4 justify-end">
            <button
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleDownloadCode}
            >
              تنزيل الشفرة
            </button>
            <button
              class={`px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateImage}
              disabled={loading()}
            >
              {loading() ? 'جاري توليد الصورة...' : 'توليد صورة'}
            </button>
            <button
              class={`px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTextToSpeech}
              disabled={loading()}
            >
              {loading() ? 'جاري توليد الصوت...' : 'تحويل النص إلى كلام'}
            </button>
            <button
              class={`px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateMarkdown}
              disabled={loading()}
            >
              {loading() ? 'جاري توليد Markdown...' : 'توليد Markdown'}
            </button>
          </div>
        </div>
        <Show when={generatedImage()}>
          <div class="mt-8 text-right">
            <h3 class="text-xl font-bold mb-2 text-purple-600">الصورة المُولدة</h3>
            <img src={generatedImage()} alt="Generated" class="w-full rounded-lg shadow-md" />
          </div>
        </Show>
        <Show when={audioUrl()}>
          <div class="mt-8 text-right">
            <h3 class="text-xl font-bold mb-2 text-purple-600">الوصف الصوتي للمشروع</h3>
            <audio controls src={audioUrl()} class="w-full" />
          </div>
        </Show>
        <Show when={markdownContent()}>
          <div class="mt-8 text-right">
            <h3 class="text-xl font-bold mb-2 text-purple-600">Markdown المُولد</h3>
            <div class="bg-white p-4 rounded-lg shadow-md">
              <SolidMarkdown children={markdownContent()} />
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default Builder;