import { IRequest } from "requests";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import "./questionList.scss";

@Component({
    template: require("./questionList.html"),
})
export class QuestionListComponent extends Vue {
    @Prop()
    questions: Array<{ id: number, question: string }>;

    get questionWithDetails(): Array<{ id: number, request: IRequest, question: string }> {
        return this.questions
            .filter((q) => this.$store.getters.requestById(q.id) !== null)
            .map((q) => ({
                id: q.id,
                request: this.$store.getters.requestById(q.id),
                question: q.question,
            }));
    }

    yes(question: { id: number }) {
        this.$store.dispatch("respondToQuestion", {
            questionId: question.id,
            result: true,
        });
    }

    no(question: { id: number }) {
        this.$store.dispatch("respondToQuestion", {
            questionId: question.id,
            result: false,
        });
    }
}
