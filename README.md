# 🔢 Group Theory Visualizer

A full-stack interactive web application that enables exploration of algebraic group structures — including **Cyclic groups (Zₙ)**, **Dihedral groups (Dₙ)**, and **Symmetric groups (Sₙ)**. The platform allows users to dynamically generate group elements, compute Cayley tables, visualize group operations, and interactively compose group elements with step-by-step computation.

> ❗ **Note**: This project has not yet been deployed publicly. A demo video is attached below to showcase functionality.

---

## 🎥 Demo Video

[![Demo Video](https://img.youtube.com/vi/-FsylIFKAGA/0.jpg)](https://youtu.be/-FsylIFKAGA "Group Theory Visualizer Demo")

---

## 🌐 What the Application Does

- Supports **Zₙ**, **Dₙ**, and **Sₙ** groups:
  - **Zₙ (Cyclic)**: Integers modulo *n*, with modular addition
  - **Dₙ (Dihedral)**: Symmetries of a regular *n*-gon (rotations + reflections)
  - **Sₙ (Symmetric)**: Permutations of *n* elements, with cycle notation
- Dynamically generates group elements based on user input *n*
- Computes and displays **Cayley tables** for each group
- Provides a **drag-and-drop interface** to compose group elements
- Shows a **step-by-step breakdown** of the composition
- For Dₙ groups, includes a **polygon visualizer** to animate the geometric transformation of the final product

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)** – fast frontend development experience
- **React Router** – enables per-group-type views (e.g., D₆, S₄)
- **Custom CSS** – used for styling Cayley tables, drag-and-drop areas, and visualizer components

### Backend
- **Node.js + Express.js** – handles API requests, group logic computation, and group structure generation
- **MongoDB Atlas** – stores saved groups (if persistence is extended later)

---

## 🎯 Design Decisions

- Built as a **frontend-driven learning tool** — visualizing group theory makes it more accessible to learners
- Handled **group operation logic** on the backend for correctness, especially for non-abelian groups
- Designed a **modular architecture** to easily extend group types (e.g., adding custom groups later)
- **Drag-and-drop interaction** for element composition helps replicate the tactile intuition behind algebraic operations

---

## ✍️ Personal Takeaways

- Gained deeper insight into **group theory concepts** by implementing concrete algebraic rules (Zₙ addition, Dₙ symmetries, Sₙ permutations)
- Strengthened my skills in **full-stack development**, environment management, and API design
- Improved my understanding of how to **design interactive UIs for abstract mathematical concepts**
- Learned how to balance between mathematical correctness, performance, and user experience

---

## 📦 Next Steps

- Deploy the frontend (Vercel) and backend (Render or Railway)
- Enable **saving/sharing of composed group elements**
- Add **search/filter** functionality to navigate large Cayley tables (especially for Sₙ)
- Improve **visualization of permutations** and reflections (e.g., animate Sₙ permutations)

---

## 🧑‍💻 Author

Built by harsh!

---

## 📃 License

This project is licensed under the MIT License.
