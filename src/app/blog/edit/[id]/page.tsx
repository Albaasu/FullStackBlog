'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const editBlog = async (
  title: string | undefined,
  description: string | undefined,
  id: number
) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      id,
    }),
  });
  return res.json();
};

const deleteBlog = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

const getBlogById = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  console.log(res);
  const data = await res.json();
  console.log(data);
  return data.posts;
};

const EditPost = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const titlDescription = React.useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.loading('編集中です...'), { id: '1' };
    await editBlog(
      titleRef.current?.value,
      titlDescription.current?.value,
      params.id
    );
    toast.success('編集完了');

    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    getBlogById(params.id)
      .then((data) => {
        console.log(data);
        if (titleRef.current && titlDescription.current) {
          titleRef.current.value = data.title;
          titlDescription.current.value = data.description;
        }
      })
      .catch((err) => {
        toast.error('エラーが発生しました'), { id: '1' };
      });
  }, []);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading('削除中です...');
    await deleteBlog(params.id);
    toast.success('削除完了');
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <Toaster />
      <div>
        <div className='w-full m-auto flex my-4'>
          <div className='flex flex-col justify-center items-center m-auto'>
            <p className='text-2xl text-slate-200 font-bold p-3'>
              ブログの編集 🚀
            </p>
            <form onSubmit={handleSubmit}>
              <input
                ref={titleRef}
                id='titleInput'
                placeholder='タイトルを入力'
                type='text'
                className='rounded-md px-4 w-full py-2 my-2'
              />
              <textarea
                ref={titlDescription}
                id='descriptionInput'
                placeholder='記事詳細を入力'
                className='rounded-md px-4 py-2 w-full my-2'
              ></textarea>
              <button className='font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100'>
                更新
              </button>
              <button
                onClick={handleDelete}
                className='ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100'
              >
                削除
              </button>
            </form>
          </div>
        </div>
        ;
      </div>
    </>
  );
};

export default EditPost;
