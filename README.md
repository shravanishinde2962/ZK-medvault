# Smart ZK Medical Data Vault 🏥🔒

**Problem Statement:** Smart ZK Medical Data Vault  
**Theme:** MedTech / Smart Healthcare  
**Category:** Software  

A privacy-first medical vault system that processes health records locally on the user's device, generates Zero-Knowledge verification proofs, and renders instant dynamic QR passes for first responders.

---

## 🚀 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Python
* **Icons & UI:** Lucide React (`lucide-react`)
* **APIs & Utilities:** Web FileReader API, QRServer API
* **Data Handling:** Local Encrypted JSON / Browser Client Storage

---

## ✨ Key Features

* **Client-Side File Ingestion:** Reads uploaded `.json` and `.txt` medical files locally using the native `FileReader API` without exposing raw data to central servers.
* **Zero-Knowledge Proof Hashing:** Generates cryptographic verification hashes locally to preserve patient privacy.
* **Dynamic Emergency QR Pass:** Instantly generates dynamic QR passes using `QRServer API` containing critical vitals for paramedic access.
* **Rule-Based Symptom Analysis:** Evaluates patient-provided symptoms locally to offer initial triage insights.

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/zk-medvault.git](https://github.com/your-username/zk-medvault.git)
   cd zk-medvault
