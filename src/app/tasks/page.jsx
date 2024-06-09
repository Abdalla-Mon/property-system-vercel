"use client";
import React, { useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const initialTasks = [
  {
    title: "اضافة خصم للعقد ",
    done: true,
  },
  {
    title: "جعل رقم العقار يتم توليده تلقائيا",
    done: true,
  },
  {
    title: "تحويل الحساب الي مالك بدلا من مستاجر",
    done: true,
  },
  {
    title: "تعديل شكل الدفعات ",
    done: true,
  },
  {
    title: "ازاله مصروف العقار واتاحة اضافة مصاريف اخري",
    done: true,
  },
  {
    title: "نموذج طباعة العقد",
    done: true,
  },
  {
    title: "اضافه المتبقي من الدفعه كصف اخر في الدفعات",
    done: true,
  },
  {
    title: " تعديل الدفعه بحيث تكون اقرب ل50 او 100",
    done: true,
  },
  {
    title: "قسم الصيانة والذي يضمن تقديم طلبات الصيانة ومتابعتها",
    done: false,
  },
  {
    title: "نقل زر اضافة الوحده داخل العقار الي اسفل الفورم",
    done: true,
  },
  {
    title: "اماره ثم مدينه ثم منطقه ثم حي",
    done: false,
  },
  {
    title: "لما اذهب الي عقار يتم عرض الوحدات الخاصه بهذا العقار",
    done: true,
  },
  {
    title: "قسم الفواتير والذي يضمن متابعة الفواتير",
    done: false,
  },
  {
    title:
      "امكانيه تجديد العقد او الغاءه عند الغاء او التجديد يتم الاحتفاظ بالمعاملات القديمه مع حذف الدفعات التي لم يتم دفعها بعد",
    done: true,
  },
  {
    title: "فواصل للارقام الماليه",
    done: false,
  },
  {
    title: "وضع (-) في ارقام الهويه",
    done: false,
  },
  {
    title: "فورم الوحده والعقار يكون مودل افضل؟",
    done: true,
  },
  {
    title:
      "تقارير العقارات والتي تضمن عدة تقارير مثلا الوحدات المستاجره وغير المستاجره , المستحقات والربح والمصروفات",
    done: false,
  },
  {
    title:
      "الصفحة الرئيسية وما يتضمنها من احصائيات وتقارير وعرض المستحقات والايجار الذي قارب علي الانتهاء",
    done: false,
  },
  {
    title: "تعديل القيم الثابته للرسوم",
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const sortedTasks = tasks
    .map((task, index) => ({ ...task, index }))
    .sort((a, b) => a.done - b.done || a.index - b.index);

  return (
    <div>
      <h1>المهام</h1>
      <List>
        {sortedTasks.map((task, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`${task.index + 1}. ${task.title}`}
              style={{ textDecoration: task.done ? "line-through" : "none" }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
