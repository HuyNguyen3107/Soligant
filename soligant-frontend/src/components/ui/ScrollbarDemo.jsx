// src/components/ui/ScrollbarDemo.jsx
import React from "react";

const ScrollbarDemo = () => {
  const demoContent = Array.from({ length: 20 }, (_, i) => (
    <div key={i} className="p-3 border-b border-gray-200">
      <h4 className="font-semibold">Item {i + 1}</h4>
      <p className="text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  ));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-soligant-primary mb-6">
        Scrollbar Styles Demo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default Scrollbar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-soligant-primary text-white">
            <h3 className="font-semibold">Default Scrollbar</h3>
          </div>
          <div className="h-64 overflow-y-auto">{demoContent}</div>
        </div>

        {/* Custom Scrollbar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-soligant-primary text-white">
            <h3 className="font-semibold">Custom Scrollbar</h3>
          </div>
          <div className="h-64 overflow-y-auto scrollbar-custom">
            {demoContent}
          </div>
        </div>

        {/* Thin Scrollbar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-soligant-primary text-white">
            <h3 className="font-semibold">Thin Scrollbar</h3>
          </div>
          <div className="h-64 overflow-y-auto scrollbar-thin">
            {demoContent}
          </div>
        </div>

        {/* Rounded Scrollbar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-soligant-primary text-white">
            <h3 className="font-semibold">Rounded Scrollbar</h3>
          </div>
          <div className="h-64 overflow-y-auto scrollbar-rounded">
            {demoContent}
          </div>
        </div>

        {/* Hidden Scrollbar */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-soligant-primary text-white">
            <h3 className="font-semibold">Hidden Scrollbar</h3>
            <p className="text-xs opacity-75">Still scrollable</p>
          </div>
          <div className="h-64 overflow-y-auto scrollbar-hide">
            {demoContent}
          </div>
        </div>

        {/* Dark Scrollbar */}
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-900 text-white">
            <h3 className="font-semibold">Dark Scrollbar</h3>
          </div>
          <div className="h-64 overflow-y-auto scrollbar-dark bg-gray-800 text-white">
            {demoContent.map((item, i) => (
              <div key={i} className="p-3 border-b border-gray-600">
                <h4 className="font-semibold text-white">Item {i + 1}</h4>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm">
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">
              scrollbar-custom
            </code>
            : Custom styled scrollbar with Soligant colors
          </p>
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">
              scrollbar-thin
            </code>
            : Thin scrollbar for compact layouts
          </p>
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">
              scrollbar-rounded
            </code>
            : Rounded scrollbar for modern look
          </p>
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">
              scrollbar-hide
            </code>
            : Hidden scrollbar (content still scrollable)
          </p>
          <p>
            <code className="bg-gray-200 px-2 py-1 rounded">
              scrollbar-dark
            </code>
            : Dark themed scrollbar
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScrollbarDemo;
