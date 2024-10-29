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
    }
  };

  const handleGenerateProject = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `Generate code for a ${projectDescription()} named "${projectName()}". Specifications: ${specifications()}`,
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
        prompt: 'An illustrative image for my project'
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
        text: `Project Name: ${projectName()}. Description: ${projectDescription()}`
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
        prompt: 'Write a detailed README.md content for my project in markdown format',
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
    <div class="h-full">
      <Show when={currentStep() === 1}>
        <div class="space-y-4">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Create New Project</h2>
          <input
            type="text"
            placeholder="Project Name"
            value={projectName()}
            onInput={(e) => setProjectName(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
          <input
            type="text"
            placeholder="Project Description"
            value={projectDescription()}
            onInput={(e) => setProjectDescription(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          />
          <button
            class={`px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!(projectName() && projectDescription()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            disabled={!(projectName() && projectDescription())}
          >
            Next
          </button>
        </div>
      </Show>

      <Show when={currentStep() === 2}>
        <div class="space-y-4">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Project Specifications</h2>
          <textarea
            placeholder="Enter your project specifications..."
            value={specifications()}
            onInput={(e) => setSpecifications(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border h-40"
          ></textarea>
          <div class="flex space-x-4">
            <button
              class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              class={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateProject}
              disabled={loading()}
            >
              {loading() ? 'Generating...' : 'Generate Project'}
            </button>
          </div>
        </div>
      </Show>

      <Show when={generatedCode()}>
        <div class="mt-8">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Generated Project</h2>
          <pre class="bg-white p-4 rounded-lg shadow-md overflow-auto max-h-96">
            {generatedCode()}
          </pre>
          <div class="flex space-x-4 mt-4">
            <button
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleDownloadCode}
            >
              Download Code
            </button>
            <button
              class={`px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateImage}
              disabled={loading()}
            >
              {loading() ? 'Generating Image...' : 'Generate Image'}
            </button>
            <button
              class={`px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTextToSpeech}
              disabled={loading()}
            >
              {loading() ? 'Generating Audio...' : 'Text to Speech'}
            </button>
            <button
              class={`px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleGenerateMarkdown}
              disabled={loading()}
            >
              {loading() ? 'Generating Markdown...' : 'Generate Markdown'}
            </button>
          </div>
        </div>
        <Show when={generatedImage()}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">Generated Image</h3>
            <img src={generatedImage()} alt="Generated" class="w-full rounded-lg shadow-md" />
          </div>
        </Show>
        <Show when={audioUrl()}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">Project Audio Description</h3>
            <audio controls src={audioUrl()} class="w-full" />
          </div>
        </Show>
        <Show when={markdownContent()}>
          <div class="mt-8">
            <h3 class="text-xl font-bold mb-2 text-purple-600">Generated Markdown</h3>
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