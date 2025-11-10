<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Bilješke</h1>
    
    <!-- Poruka ako nije prijavljen -->
    <div v-if="!auth.token" class="mb-6 p-4 bg-blue-50 text-blue-700 rounded border border-blue-200">
      <p>💡 <strong>Demo mod:</strong> Ovo su javne bilješke. Prijavi se da možeš dodavati i uređivati bilješke.</p>
      <button @click="$router.push('/login')" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Prijavi se
      </button>
    </div>
    
    <!-- Kontrole -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <!-- Filter po klijentu -->
      <div class="flex-1">
        <select v-model="selectedClient" @change="loadNotes" class="w-full md:w-auto p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Svi klijenti</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
      </div>

      <!-- Forma za dodavanje bilješke (samo za prijavljene) -->
      <button v-if="auth.token" @click="showForm = true; editing = null" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition whitespace-nowrap">
        + Nova bilješka
      </button>
    </div>

    <!-- Forma za bilješke (samo za prijavljene) -->
    <div v-if="showForm && auth.token" class="mb-6 p-4 bg-gray-50 rounded border">
      <h3 class="font-bold mb-3">{{ editing ? 'Uredi bilješku' : 'Nova bilješka' }}</h3>
      <div class="space-y-3">
        <select v-model="form.client_id" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          <option value="">Odaberi klijenta *</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
        <input v-model="form.title" placeholder="Naslov bilješke *" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <textarea v-model="form.content" placeholder="Sadržaj bilješke..." class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"></textarea>
        <div class="flex space-x-2">
          <button @click="saveNote" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {{ editing ? 'Ažuriraj' : 'Dodaj' }}
          </button>
          <button @click="cancelForm" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
            Otkaži
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p>Učitavanje bilješki...</p>
    </div>

    <!-- Prazna state -->
    <div v-else-if="notes.length === 0" class="text-center py-8 bg-white rounded shadow">
      <p class="text-gray-500">Nema bilješki.</p>
    </div>

    <!-- Lista bilješki -->
    <div v-else class="space-y-4">
      <div v-for="note in notes" :key="note.id" class="p-4 bg-white rounded shadow hover:shadow-md transition">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <h3 class="font-bold text-lg text-gray-800 mb-1">{{ note.title }}</h3>
            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
              <span><strong>Klijent:</strong> {{ note.client_name || getClientName(note.client_id) }}</span>
              <span><strong>Autor:</strong> {{ note.user_name }}</span>
              <span><strong>Datum:</strong> {{ new Date(note.created_at).toLocaleString('hr-HR') }}</span>
              <span v-if="note.updated_at !== note.created_at" class="text-gray-500">
                (ažurirano: {{ new Date(note.updated_at).toLocaleString('hr-HR') }})
              </span>
            </div>
          </div>
          <div v-if="auth.token" class="flex space-x-2 ml-4">
            <button @click="editNote(note)" class="text-blue-600 hover:text-blue-800 transition" title="Uredi">
              ✏️
            </button>
            <button @click="deleteNote(note.id)" class="text-red-600 hover:text-red-800 transition" title="Obriši">
              🗑️
            </button>
          </div>
        </div>
        <p class="text-gray-700 whitespace-pre-wrap">{{ note.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import { useAuth } from '@/stores/auth.js';

const auth = useAuth();
const notes = ref([]);
const clients = ref([]);
const selectedClient = ref('');
const showForm = ref(false);
const editing = ref(null);
const loading = ref(false);
const form = ref({ client_id: '', title: '', content: '' });

const loadClients = async () => {
  try {
    const endpoint = auth.token ? '/clients' : '/public/clients';
    const res = await api.get(endpoint);
    clients.value = res.data;
  } catch (err) {
    console.error('Error loading clients:', err);
  }
};

const loadNotes = async () => {
  loading.value = true;
  try {
    const endpoint = auth.token ? '/notes' : '/public/notes';
    const params = selectedClient.value ? { client_id: selectedClient.value } : {};
    const res = await api.get(endpoint, { params });
    notes.value = res.data;
  } catch (err) {
    console.error('Error loading notes:', err);
  } finally {
    loading.value = false;
  }
};

const getClientName = (clientId) => {
  const client = clients.value.find(c => c.id === clientId);
  return client ? client.name : 'Nepoznato';
};

const saveNote = async () => {
  if (!form.value.client_id || !form.value.title) {
    alert('Klijent i naslov su obavezni');
    return;
  }

  try {
    if (editing.value) {
      await api.put(`/notes/${editing.value.id}`, form.value);
    } else {
      await api.post('/notes', form.value);
    }
    cancelForm();
    loadNotes();
  } catch (err) {
    alert(err.response?.data?.error || 'Greška pri čuvanju bilješke');
  }
};

const editNote = (note) => {
  form.value = { ...note };
  editing.value = note;
  showForm.value = true;
};

const deleteNote = async (id) => {
  if (confirm('Jeste li sigurni da želite obrisati ovu bilješku?')) {
    try {
      await api.delete(`/notes/${id}`);
      loadNotes();
    } catch (err) {
      alert(err.response?.data?.error || 'Greška pri brisanju bilješke');
    }
  }
};

const cancelForm = () => {
  form.value = { client_id: '', title: '', content: '' };
  showForm.value = false;
  editing.value = null;
};

onMounted(() => {
  loadClients();
  loadNotes();
});
</script>
