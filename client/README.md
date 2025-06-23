# 🔢 Group Theory Visualizer

This is a full-stack interactive web application designed to help students and educators explore **algebraic group structures**, with a focus on **Dihedral groups (Dₙ)**. The app dynamically generates group elements, computes Cayley tables, and visualizes group operations both algebraically and geometrically.

> ❗ **Note**: This project has not yet been deployed publicly. A demo video is attached to showcase the app in action.

---

## 🎥 Demo Video

[Insert video link here — e.g. Loom, Google Drive, or YouTube]

---

## 🌐 What the Application Does

- Lets users select a Dihedral group Dₙ and generates its group elements:  
  - Rotations: _e, r, r², ..., rⁿ⁻¹_  
  - Reflections: _s, sr, sr², ..., srⁿ⁻¹_
- Computes and displays the **Cayley table** for the group based on group multiplication rules.
- Supports **drag-and-drop composition** of group elements to compute complex products.
- Displays a **step-by-step breakdown** of the composition process.
- Offers a **polygon visualizer** that shows the geometric meaning of the final group element (e.g., rotation vs. reflection).

---

## 🛠️ Tech Stack

### Frontend
- **React (with Vite)**: for fast dev server and easy configuration
- **React Router**: for dynamic routing by group type (e.g., D₄, D₅)
- **Custom CSS**: for responsive styling and visual feedback on drag-and-drop

### Backend
- **Node.js + Express.js**: to handle API requests and compute group logic server-side
- **MongoDB (via Atlas)**: to store and retrieve saved group structures

---

## 🎯 Why I Made Certain Design Decisions

- **Frontend-first development**: Group logic is highly visual, so building the UI early helped guide backend needs.
- **Cayley table computed server-side**: Ensures correctness, especially for non-abelian groups like Dₙ, and keeps frontend logic clean.
- **Dihedral groups as a case study**: Dₙ groups are concrete, visually rich, and non-commutative — making them pedagogically valuable.
- **Drag-and-drop UX**: Chosen to mimic the tactile feel of composing elements in group theory proofs.

---

## ✍️ Personal Takeaways

- **Reinforced my understanding of abstract algebra** through implementation of concrete examples like D₄, D₆, etc.
- Gained deeper experience in **full-stack development**, especially connecting frontend logic with backend computations and database persistence.
- Learned to **design for interactivity** — the drag-and-drop composer and geometric visualizer taught me how to make abstract math feel intuitive.
- Navigated common challenges like CORS, environment variable management, and data consistency between client and server.

---

## 📦 Next Steps

- Deploy frontend to **Vercel** and backend to **Render** or **Railway**
- Add support for **Cyclic (Zₙ)** and **Symmetric (Sₙ)** groups
- Allow users to **save** and **share** their own custom groups
- Extend geometric visualizations for more types of transformations

---

## 🧑‍💻 Author

Built by [Your Name](https://github.com/your-username)

---

## 📃 License

This project is licensed under the MIT License.
