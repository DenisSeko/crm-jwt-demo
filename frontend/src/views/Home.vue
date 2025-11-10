<template>
  <div class="text-center py-20">
    <h1 class="text-5xl font-bold text-blue-600 mb-4">CRM JWT Demo</h1>
    <p class="text-xl text-gray-600 mb-8">Jednostavan CRM sa JWT autentifikacijom</p>
    <div class="space-x-4">
      <button @click="$router.push('/login')" class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
        Idi na Login
      </button>
      <button @click="$router.push('/dashboard')" class="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition">
        Klijenti
      </button>
      <button @click="$router.push('/notes')" class="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-purple-700 transition">
        Bilješke
      </button>
    </div>
    
    <div class="mt-12 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Demo Podaci</h2>
      <div class="text-left space-y-3">
        <p><strong>👥 Korisnici:</strong></p>
        <ul class="list-disc list-inside ml-4">
          <li><strong>demo@demo.com</strong> / demo123 (Demo User)</li>
          <li><strong>ivan.horvat@example.com</strong> / demo123 (Ivan Horvat)</li>
        </ul>
        
        <p><strong>🏢 Klijenti:</strong></p>
        <ul class="list-disc list-inside ml-4">
          <li>Marko Marković (IT Solutions d.o.o.)</li>
          <li>Petra Horvat (Digital Agency)</li>
          <li>Ivana Kovačić (Web Studio)</li>
          <li>Ana Marić (Tech Innovations)</li>
        </ul>
        
        <p><strong>📝 Bilješke:</strong></p>
        <ul class="list-disc list-inside ml-4">
          <li>6 demo bilješki povezanih s klijentima</li>
        </ul>
      </div>
    </div>
  </div>
</template>
