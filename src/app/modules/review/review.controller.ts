import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { reviewService } from './review.service';

// Create Review
const createreview = catchAsync(async (req: Request, res: Response) => {
  const creatorId = req.user?.userId;

  if (!creatorId) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }

  const { reciverId, description } = req.body;
  const newReview = await reviewService.createreview(
    creatorId,
    reciverId,
    description,
  );
  res.status(201).json({
    status: 'success',
    data: newReview,
  });
});

// Get All Reviews
const getAllreview = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.getAllreview();
  res.status(200).json({
    status: 'success',
    data: reviews,
  });
});

// Get Review by ID
const getreviewById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const review = await reviewService.getreviewById(userId);
  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: review,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.params);
  const { id } = req.params;
  const review = await reviewService.getreviewById(id);
  if (!review) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: review,
  });
});

// Update Review
const updatereview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description } = req.body;
  const updatedReview = await reviewService.updatereview(id, description);
  if (!updatedReview) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: updatedReview,
  });
});

// Delete Review
const deletereview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedReview = await reviewService.deletereview(id);
  if (!deletedReview) {
    return res.status(404).json({
      status: 'fail',
      message: 'Review not found',
    });
  }
  res.status(204).json({
    status: 'success',
    message: 'Review deleted successfully',
  });
});

export const reviewController = {
  createreview,
  getAllreview,
  getreviewById,
  updatereview,
  deletereview,
  getUserById,
};
